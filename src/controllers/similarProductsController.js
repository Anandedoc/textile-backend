/** @format */

const db = require("../models");
const HttpError = require("../models/httpErrorModel");
const { sequelize } = require("../models");
import { Op } from "sequelize";

const { awsFileUpload, awsFileDelete } = require("../utils/awsUpload");

//Create Main Model

const SimilarProducts = db.similar_products;
const ProductDetails = db.product_details;
const ProductImages = db.product_images;

//1.Add Similar Prouduct Images

const addImage = async (req, res, next) => {
  let similarProductDetails = { ...req.body, createdBy: 1 };

  const productDetails = await ProductDetails.findOne({
    where: { id: similarProductDetails.productDetailId },
    attributes: { exclude: ["id"] },
  });

  let uploadedImgNames = [];
  console.log(productDetails.dataValues);

  try {
    const uploadImageFiles = req.files.image.map((file) =>
      awsFileUpload(file, next)
    );
    uploadedImgNames = await Promise.all(uploadImageFiles);
  } catch (err) {
    return next(
      new HttpError(err?.message || "Could not upload images to aws", 400)
    );
  }

  try {
    const t = await sequelize.transaction();

    const product = await ProductDetails.create(
      { ...productDetails.dataValues, isSimilarProduct: true },
      {
        transaction: t,
      }
    );

    const updateToDb = uploadedImgNames.map((file) => {
      let imageDetails = {
        productDetailId: product.id,
        image: file.Location,
        createdBy: 1,
      };

      return ProductImages.create(imageDetails, { transaction: t });
    });

    similarProductDetails = {
      ...similarProductDetails,
      currentProductDetailId: product.id,
    };

    await SimilarProducts.create(similarProductDetails, { transaction: t });

    await Promise.all(updateToDb);
    await t.commit();

    res
      .status(201)
      .json({ success: true, message: "Product created successfully" });
  } catch (e) {
    await t.rollback();
    const deleteUploadedFiles = uploadedImgNames.map((data) =>
      awsFileDelete(data.Location)
    );
    await Promise.all(deleteUploadedFiles);

    return next(new HttpError(e || "Creating product failed", 400));
  }
};

//2.Get SimilarProducts Based on ProductDetailId

const getSimilarProductId = async (req, res, next) => {
  const productDetailId = req.params.id;
  let similarProduct = await SimilarProducts.findOne({
    where: { currentProductDetailId: parseInt(productDetailId) },
  });
  console.log(similarProduct);

  let similarProducts = await SimilarProducts.findAll({
    where: {
      [Op.or]: [
        { productDetailId: parseInt(productDetailId) },
        { currentProductDetailId: parseInt(productDetailId) }
      ],
    },
  });
  let newSimilarProducts = null;

  if (similarProduct?.productDetailId) {
    newSimilarProducts = await SimilarProducts.findAll({
      where: {
        [Op.or]: [
          { currentProductDetailId: parseInt(similarProduct?.productDetailId) },
          { productDetailId: parseInt(similarProduct?.productDetailId) },
        ],
      },
    });
  }

  res
    .status(200)
    .json({
      success: true,
      data: { ...similarProducts, ...newSimilarProducts },
    });
};

module.exports = {
  addImage,
  getSimilarProductId,
};
