/** @format */

const db = require("../models");
const HttpError = require("../models/httpErrorModel");
const { sequelize } = require("../models");
const { awsFileUpload } = require("../utils/awsUpload");

const ProductCatagory = db.product_categories;
const ProductDetails = db.product_details;

const addProductCategory = async (req, res, next) => {
  try {
    const data = await awsFileUpload(req.files.image, next);

    let category = {
      name: req.body.name,
      productId: req.body.productId,
      productTypeId: req.body.productTypeId,
      stockCount: req.body.stockCount,
      image: data.Location,
      createdBy: 1,
    };

    await ProductCatagory.create(category);

    res
      .status(201)
      .json({
        success: true,
        message: "Product category created",
        product: category,
      });
  } catch (error) {
    return next(new HttpError(error?.message || "Server error", 400));
  }
};

const getAllProductCategories = async (req, res, next) => {
  const { id } = req.params;
  try {
    const products = await ProductCatagory.findAll({
      where: {
        productTypeId: id,
      },
    });

    res.status(200).json({ success: true, data: products });
  } catch (e) {
    return next(new HttpError(e, 404));
  }
};

const updateProductCategory = async (req, res, next) => {
  const id = req.params.id;
  let category = {
    name: req.body.name,
    productId: req.body.productId,
    productTypeId: req.body.productTypeId,
    stockCount: req.body.stockCount,
    createdBy: 1,
  };

  try {
    const productCategory = await ProductCatagory.findOne({
      where: { id: id },
    });

    if (!productCategory) {
      return next(new HttpError("product category not found", 404));
    }

    await ProductCatagory.update(category, { where: { id } });

    res
      .status(200)
      .json({ success: true, message: "product category updated" });
  } catch (e) {
    return next(new HttpError(e, 400));
  }
};

const deleteProductCategory = async (req, res, next) => {
  const id = parseInt(req.params.id);

  try {
    if (isNaN(id)) {
      return next(new HttpError("Invalid product type Id", 400));
    }
    await sequelize.transaction(async (t) => {
      const productCategory = await ProductCatagory.findOne(
        { where: { id } },
        { transaction: t }
      );

      if (!productCategory) {
        return next(new HttpError("product category not found", 404));
      }

      await ProductDetails.destroy({
        where: { productCategoryId: id },
        transaction: t,
      });

      const deletedProduct = await ProductCatagory.destroy({
        where: { id },
        transaction: t,
      });

      if (!deletedProduct) {
        return next(new HttpError("Product category not deleted", 400));
      }

      res
        .status(200)
        .json({ success: true, message: "product category deleted" });
    });
  } catch (e) {
    console.log(e);
    return next(new HttpError(e, 400));
  }
};

module.exports = {
  addProductCategory,
  getAllProductCategories,
  updateProductCategory,
  deleteProductCategory,
};
