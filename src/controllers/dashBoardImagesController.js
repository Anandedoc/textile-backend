/** @format */

const db = require("../models");
const HttpError = require("../models/httpErrorModel");
const productDetailsModel = require("../models/productDetailsModel");

const { awsFileUpload, awsFileDelete } = require("../utils/awsUpload");

//Create Main Model

const DashBoardImages = db.dashboard_images;
const ProductDetails = db.product_details;
const ProductImages = db.product_images;

//1.Add DashBoardImages

const addImage = async (req, res, next) => {
  try {
    const data = await awsFileUpload(req.files.image, next);
    let detail = {
      image: data.Location,
      createdBy: 1,
    };

    await DashBoardImages.create(detail);

    res.status(201).json({
      success: true,
      message: "Image Added Successfully",
      product: detail,
    });
  } catch (error) {
    return next(new HttpError(error?.message || "Server error", 400));
  }
};

//2.Get All DashBoardImagess

const getAllImages = async (req, res, next) => {
  const allDashBoardImagess = await DashBoardImages.findAll({});
  res.status(200).json({ success: true, data: allDashBoardImagess });
};

const getNewArrivals = async (req, res, next) => {
  try {
    const newArrivals = await ProductDetails.findAll({
      limit: 4,
      order: [["id", "desc"]],
      include: { model: ProductImages, limit: 2 },
    });

    res.status(200).json({ success: true, data: newArrivals });
  } catch (error) {
    console.log(e);
    return next(new HttpError(error.message || "Server not reachable", 500));
  }
};

// 5.Delete DashBoardImages

const deleteImage = async (req, res, next) => {
  let id = req.params.id;
  try {
    const imageDetails = await DashBoardImages.findOne({ id });

    await DashBoardImages.destroy({ where: { id } });
    await awsFileDelete(imageDetails.image);
    res
      .status(200)
      .json({ success: true, message: "Image Deleted Successfully" });
  } catch (error) {
    console.log(error);
    return next(new HttpError(error.message || "Server not reachable", 500));
  }
};

module.exports = {
  addImage,
  getAllImages,
  deleteImage,
  getNewArrivals,
};
