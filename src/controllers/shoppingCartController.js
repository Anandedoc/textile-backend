/** @format */

const db = require("../models");
const HttpError = require("../models/httpErrorModel");

const ShoppingCart = db.shopping_cart;

const getShoppingCartList = async (req, res, next) => {
  try {
    const shoppingList = await ShoppingCart.findAll({
      where: { userId: req.user.id },
      attributes: { exclude: ["createdTime", "userId"] },
    });

    res.status(200).json({ success: true, data: shoppingList });
  } catch (error) {
    return next(new HttpError(error?.message || "Server error", 500));
  }
};

const createShoppingCart = async (req, res, next) => {
  try {
    const { productDetailsId, discountPrice, name, image, count, actualPrice, color } =
      req.body;
    const userId = req.user.id;

    const existingCart = await ShoppingCart.findOne({
      where: { productDetailsId: parseInt(productDetailsId, 10), userId },
    });

    if (existingCart) {
      await ShoppingCart.update(
        { count: parseInt(count, 10), color },     
        { where: { id: existingCart.id } }
      );
    } else {
      await ShoppingCart.create({
        productDetailsId: parseInt(productDetailsId, 10),
        discountPrice: parseInt(discountPrice, 10),
        name,
        image,
        count: parseInt(count, 10),
        actualPrice: parseInt(actualPrice, 10),
        color, 
        userId,
      });
    }

    res
      .status(201)
      .json({ success: true, message: "Shopping cart added successfully" });
  } catch (error) {
    return next(new HttpError(error?.message || "Server error", 400));
  }
};

const updateShoppingCart = async (req, res, next) => {
  const { removedProducts, updatedProducts } = req.body;

  try {
    if (removedProducts.length) {
      const deletePromise = removedProducts.map((item) =>
        ShoppingCart.destroy({ where: { id: parseInt(item.id, 10) } })
      );
      await Promise.all(deletePromise);
    }

    if (updatedProducts.length) {
      const updatePromise = updatedProducts.map((item) =>
        ShoppingCart.update(
          { count: parseInt(item.count, 10) },
          { where: { id: parseInt(item.id, 10) } }
        )
      );
      await Promise.all(updatePromise);
    }

    res
      .status(201)
      .json({ success: true, message: "Shopping cart updated successfully" });
  } catch (error) {
    return next(new HttpError(error?.message || "Server error", 400));
  }
};

module.exports = {
  getShoppingCartList,
  createShoppingCart,
  updateShoppingCart,
};
