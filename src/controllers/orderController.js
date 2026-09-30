/** @format */

const db = require("../models");
const { Op } = require("sequelize");
const HttpError = require("../models/httpErrorModel");
const { sequelize } = require("../models");
const { OrderStatus, UserRole } = require("../utils/enums");

const Orders = db.orders;
const OrderDetails = db.order_details;
const TrackingPartners = db.tracking_partners;
const User = db.user;

const createOrder = async (req, res, next) => {
  try {
    const t = await sequelize.transaction();

    let order = {
      amount: req.body.order.amount,
      address: req.body.order.address,
      status: OrderStatus.ORDER_PLACED,
      count: req.body.order.count,
      createdBy: req.user.id,
      iCOD: req.body.order.isCOD,
    };

    let user = await User.findOne({
      where: { id: order.createdBy },
    });

    if (!user.phoneNumber) {
      let address = JSON.parse(order.address);
      let status = updateUserAddress(order.createdBy, address);
      await Promise.resolve(status);
    }

    let createdOrder = await Orders.create(order, { transaction: t });

    let { orderDetails } = req.body;

    let updateToDb = orderDetails.map((detail) => {
      let productDetails = {
        count: detail.count,
        color: detail.color,
        name: detail.name,
        image: detail.image,
        amount: detail.amount,
        orderId: createdOrder?.id,
        productDetailId: detail.productDetailId,
        createdBy: req.body.order.userId,
      };

      return OrderDetails.create(productDetails, { transaction: t });
    });

    await Promise.all(updateToDb);
    await t.commit();

    let orderNumberUpdated = updateOrderNumber(createdOrder.id);
    await Promise.resolve(orderNumberUpdated);

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      product: "createOrder",
    });
  } catch (error) {
    return next(new HttpError(error?.message || "Server error", 400));
  }
};

const updateOrderNumber = async (id) => {
  return Orders.update(
    { orderNumber: `RVMS-${1000 + parseInt(id)}` },
    { where: { id } }
    // { transaction: t }
  );
};

const updateUserAddress = async (id, address) => {
  let userAddress = {
    phoneNumber: address?.mobileNo,
    doorNo: address?.doorNo,
    street: address?.streetName,
    city: address?.city,
    pincode: address?.pinCode,
  };
  return User.update(
    { ...userAddress },
    {
      where: {
        id,
      },
    }
  );
};

const getOrderById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const orderDetails = await Orders.findOne({
      where: {
        id,
      },
      include: [{ model: TrackingPartners }, { model: OrderDetails }],
    });

    res.status(200).json({ success: true, data: orderDetails ?? [] });
  } catch (error) {
    return next(new HttpError(error.message || "Server not reachable", 500));
  }
};

const getOrderByUser = async (req, res, next) => {
  try {
    const id = req.user.id;
    const userRole = req?.user.role;
    let orderDetails = [];
    if (userRole === UserRole.CUSTOMER) {
      orderDetails = await Orders.findAll({
        where: {
          createdBy: id
        },
        include: { model: OrderDetails },
        order: [["id", "DESC"]],
      });
    } else if (userRole === UserRole.ADMIN) {
      orderDetails = await Orders.findAll({
        include: { model: OrderDetails },
        order: [["id", "DESC"]],
      });
    }

    res.status(200).json({ success: true, data: orderDetails ?? [] });
  } catch (error) {
    return next(new HttpError(error.message || "Server not reachable", 500));
  }
};

const updateOrderAddress = async (req, res, next) => {
  let orderDetails = {
    orderId: req.body.orderId,
    address: req.body.address,
  };

  try {
    await Orders.update(
      { address: orderDetails.address },
      { where: { id: orderDetails.orderId } }
    );

    res.status(200).json({
      success: true,
      message: "Address updated successfully",
      address: orderDetails.address,
    });
  } catch (e) {
    return next(new HttpError(e, 400));
  }
};

const confirmOrder = async (req, res, next) => {
  let orderDetails = {
    orderId: req.body.orderId,
    isEditable: req.body.isEditable,
    status: req.body.isEditable
      ? OrderStatus.ORDER_PLACED
      : OrderStatus.ORDER_CONFIRMED,
  };
  try {
    await Orders.update(
      { isEditable: orderDetails.isEditable, status: orderDetails.status },
      { where: { id: orderDetails.orderId } }
    );

    res.status(200).json({
      success: true,
      message: orderDetails.isEditable
        ? "Order Confirmed successfully"
        : "Success",
    });
  } catch (e) {
    return next(new HttpError(e, 400));
  }
};

const dispatchOrder = async (req, res, next) => {
  let orderDetails = {
    orderId: req.body.orderId,
    status: OrderStatus.DISPATCHED,
    trackingPartnerId: req.body.trackingPartnerId,
    trackingNumber: req.body.trackingId,
  };
  try {
    await Orders.update(
      {
        status: orderDetails.status,
        trackingPartnerId: orderDetails.trackingPartnerId,
        trackingNumber: orderDetails.trackingNumber,
        isEditable: false,
      },
      { where: { id: orderDetails.orderId } }
    );

    res.status(200).json({
      success: true,
      message: "Order Dispatched successfully",
      address: orderDetails.address,
    });
  } catch (e) {
    return next(new HttpError(e, 400));
  }
};

const deleteOrder = async (req, res, next) => {
  const id = parseInt(req.params.id);

  try {
    await sequelize.transaction(async (t) => {
      const deletedOrder = await Orders.update(
        {
          status: OrderStatus.CANCEL_REQUESTED,
          transaction: t,
        },
        { where: { id } }
      );

      if (!deletedOrder) {
        return next(new HttpError("Order not cancelled", 400));
      }

      res.status(200).json({ success: true, message: "Requested for cancel" });
    });
  } catch (e) {
    console.log(e);
    return next(new HttpError(e, 400));
  }
};

const completeOrder = async (req, res, next) => {
  const { id } = req.params;
  try {
    await Orders.update(
      { status: OrderStatus.COMPLETED, isEditable: false },
      { where: { id } }
    );

    res.status(200).json({ success: true, message: "Success" });
  } catch (e) {
    return next(new HttpError(e.message || "Server not reachable", 500));
  }
};

const refundOrder = async (req, res, next) => {
  const { id } = req.params;
  try {
    await Orders.update({ isRefunded: true, status: OrderStatus.REFUNDED }, { where: { id } });

    res.status(200).json({ success: true, message: "Refund Status Updated" });
  } catch (e) {
    return next(new HttpError(e.message || "Server not reachable", 500));
  }
};

module.exports = {
  getOrderById,
  createOrder,
  dispatchOrder,
  confirmOrder,
  getOrderByUser,
  refundOrder,
  deleteOrder,
  completeOrder,
  updateOrderAddress,
  //   addProductCategory,
  //   getAllProductCategories,
  //   updateProductCategory,
  //   deleteProductCategory,
};
