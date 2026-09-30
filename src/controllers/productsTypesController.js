/** @format */

const db = require("../models");
const HttpError = require("../models/httpErrorModel");

const ProductType = db.product_types;
const ProductCategory = db.product_categories;
const ProductImages = db.product_images;
const ProductDetails = db.product_details;
const { sequelize } = require("../models");

const addProductType = async (req, res, next) => {
  try {
    let info = {
      name: req.body.name,
      productId: req.body.productId,
      createdBy: 1,
    };

    await ProductType.create(info);
    res
      .status(201)
      .json({ success: true, message: "Product Type Created Successfully" });
  } catch (err) {
    return next(new HttpError(err.message || "Something went wrong", 400));
  }
};

const getAllProductTypes = async (req, res, next) => {
  try {
    const allProducts = await ProductType.findAll({
      attributes: ["id", "name"],
      include: {
        model: ProductDetails,
        attributes: {
          exclude: [
            "createdTime",
            "priceFor5",
            "priceFor10",
            "priceFor15",
            "createdBy",
          ],
        },
        include: {
          model: ProductImages,
          attributes: ["image"],
          limit: 2 
        },
        order: [["id", "desc"]],
        limit: 4,
      },
    });
    res.status(200).json({ success: true, data: allProducts });
  } catch (err) {
    return next(new HttpError(err?.message || "Something went wrong", 400));
  }
};

const getSingleProductType = async (req, res, next) => {
  const id = parseInt(req.params.id, 10);

  if (!id) {
    return next(new HttpError("Product type Id is not found", 400));
  }

  try {
    const productType = await ProductType.findOne({
      where: { id },
      include: [ProductCategory],
    });
    if (!productType) {
      return next(new HttpError("Product Type not found", 400));
    }

    res.status(200).json({ success: true, data: productType });
  } catch (err) {
    return next(new HttpError(err?.message || "Something went wrong", 400));
  }
};

const updateProductType = async (req, res, next) => {
  const id = parseInt(req.params.id, 10);

  if (!id) {
    return next(new HttpError("Product type Id is not found", 400));
  }

  try {
    const [updatedProduct] = await ProductType.update(req.body, {
      where: { id },
    });

    if (!updatedProduct) {
      return next(new HttpError("Product type is not found", 400));
    }

    res
      .status(200)
      .json({ success: true, message: "Product Type Updated Successfully" });
  } catch (error) {
    return next(new HttpError(error?.message || "Something went wrong", 400));
  }
};

const deleteProdutType = async (req, res, next) => {
  const id = parseInt(req.params.id, 10);

  try {
    if (isNaN(id)) {
      return next(new HttpError("Invalid product type Id", 400));
    }
    await sequelize.transaction(async (t) => {
      await ProductDetails.destroy({
        where: { productTypeId: id },
        transaction: t,
      });
      await ProductCategory.destroy({
        where: { productTypeId: id },
        transaction: t,
      });
      await ProductType.destroy({ where: { id }, transaction: t });
      res
        .status(200)
        .json({ success: true, message: "Product Type Deleted Successfully" });
    });
  } catch (error) {
    return next(new HttpError(err?.message || "Something went wrong", 400));
  }
};

module.exports = {
  addProductType,
  getAllProductTypes,
  getSingleProductType,
  updateProductType,
  deleteProdutType,
};
