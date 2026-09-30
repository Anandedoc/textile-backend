/** @format */

const { Op } = require("sequelize");

const db = require("../models");
const HttpError = require("../models/httpErrorModel");
const { sequelize } = require("../models");
const { awsFileUpload, awsFileDelete } = require("../utils/awsUpload");
const multiColorModel = require("../models/multiColorModel");

const ProductDetails = db.product_details;
const SimilarProducts = db.similar_products;
const ProductImages = db.product_images;
const ProductType = db.product_types;
const MultiColors = db.multi_colors;

const addProductDetails = async (req, res, next) => {
  let productDetails = { ...req.body, createdBy: 1 };
  let uploadedImgNames = [];

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
  const t = await sequelize.transaction();

  try {
    const product = await ProductDetails.create(
      { ...productDetails, color: "" },
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

    // if(Array.isArray(productDetails.color)){
    //   productDetails.color.forEach(async element => {
    //     await SimilarProducts.create(
    //       {
    //         productDetailId: product.id,
    //         currentProductDetailId: product.id,
    //         color:JSON.parse(element).color,
    //         hexCode: JSON.parse(element).hexCode,
    //       },
    //       { transaction: t }
    //     );
    //   });

    // }else{
    //   await SimilarProducts.create(
    //     {
    //       productDetailId: product.id,
    //       currentProductDetailId: product.id,
    //       color: JSON.parse(productDetails.color).color,
    //       hexCode: JSON.parse(productDetails.color).hexCode,
    //     },
    //     { transaction: t }
    //   );
    // }

    if (Array.isArray(JSON.parse(productDetails.color))) {
      JSON.parse(productDetails.color).forEach(async (element) => {
        await MultiColors.create(
          {
            productDetailId: product.id,
            color: element.color,
            hexCode: element.hexCode,
          },
          { transaction: t }
        );
      });
    } else {
      await MultiColors.create(
        {
          productDetailId: product.id,
          color: JSON.parse(productDetails.color).color,
          hexCode: JSON.parse(productDetails.color).hexCode,
        },
        { transaction: t }
      );
    }

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

const getAllProductDetails = async (req, res, next) => {
  try {
    const products = await ProductDetails.findAll({
      where: req.body,
      include: { model: ProductImages, limit: 2 },
    });

    res.status(200).json({ success: true, data: products });
  } catch (e) {
    console.log(e);
    return next(new HttpError(e, 404));
  }
};

const updateProductDetails = async (req, res, next) => {
  const id = req.params.id;
  let newProductDetails = { ...req.body, createdBy: 1 };

  try {
    const productDetails = await ProductDetails.findOne({
      where: { id },
    });

    if (!productDetails) {
      return next(new HttpError("product Details not found", 404));
    }

    await ProductDetails.update(newProductDetails, { where: { id } });

    res.status(200).json({ success: true, message: "product details updated" });
  } catch (e) {
    return next(new HttpError(e, 400));
  }
};

const deleteProdutDetails = async (req, res, next) => {
  const id = req.params.id;

  try {
    const productDetails = await ProductDetails.findOne({ where: { id } });

    if (!productDetails) {
      return next(new HttpError("product details not found", 404));
    }

    await ProductDetails.destroy({ where: { id } });

    res.status(200).json({ success: true, message: "product details deleted" });
  } catch (e) {
    return next(new HttpError(e, 400));
  }
};

const getSingleProductDetails = async (req, res, next) => {
  const id = parseInt(req.params.id);
  try {
    if (isNaN(id)) {
      return next(new HttpError("Invalid product details Id", 400));
    }

    const productDetailsPromise = ProductDetails.findOne({ where: { id } });
    const productImagesPromise = ProductImages.findAll({
      where: { productDetailId: id },
    });

    const multiColorSPromise = MultiColors.findAll({
      where: { productDetailId: id },
    });
    const [productDetails, productImages, multiColors] = await Promise.all([
      productDetailsPromise,
      productImagesPromise,
      multiColorSPromise,
    ]);

    const products = await ProductDetails.findAll({
      where: {
        productCategoryId: parseInt(productDetails.productCategoryId, 10),
      },
      include: { model: ProductImages, limit: 1 },
    });

    res.status(200).json({
      success: true,
      data: { productDetails, productImages, products, multiColors },
    });
  } catch (error) {
    return next(new HttpError(err?.message || "Something went wrong", 400));
  }
};

const searchByName = async (req, res, next) => {
  const { productName } = req.query;

  if (!productName) {
    return next(new HttpError("Invalid search", 400));
  }

  try {
    const searchDetails = await ProductDetails.findAll({
      where: {
        [Op.or]: [
          {
            name: { [Op.like]: `%${productName}%` },
          },
        ],
      },
      attributes: {
        exclude: [
          "createdTime",
          "priceFor5",
          "priceFor10",
          "priceFor15",
          "createdBy",
        ],
      },
      include: { model: ProductImages, limit: 1 },
    });

    const customized = JSON.parse(JSON.stringify(searchDetails));

    customized.forEach((ele, i) => {
      ele.image = searchDetails[i].product_images[0]?.image ?? null;
      delete ele.product_images;
    });

    res.status(200).json({ success: true, data: customized });
  } catch (error) {
    console.log(error);
    return next(new HttpError(error?.message || "Server not reachable", 500));
  }
};

const getDetailsByProductType = async (req, res, next) => {};

module.exports = {
  addProductDetails,
  getAllProductDetails,
  getSingleProductDetails,
  updateProductDetails,
  deleteProdutDetails,
  searchByName,
};
