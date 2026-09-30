/** @format */

const db = require("../models");
const HttpError = require("../models/httpErrorModel");

const Reviews = db.reviews;

const addReview = async (req, res, next) => {
  let reviewDetails = { ...req.body, createdBy: 1 };

  try {
    await Reviews.create(reviewDetails);
    res
      .status(201)
      .json({ success: true, message: "Review added successfully" });
  } catch (error) {
    return next(new HttpError(error?.message || "Server error", 400));
  }
};

const getAllReviews = async (req, res, next) => {
  const { id } = req.params;
  try {
    const reviews = await Reviews.findAll({
      where: {
        productDetailId: id,
      },
    });

    res.status(200).json({ success: true, data: reviews });
  } catch (e) {
    return next(new HttpError(e, 404));
  }
};

const deleteReview = async (req, res, next) => {
  const id = parseInt(req.params.id);

  try {
    if (isNaN(id)) {
      return next(new HttpError("Invalid review Id", 400));
    }
    const review = await Reviews.findOne({ where: { id } });

    if (!review) {
      return next(new HttpError("review not found", 404));
    }

    await Reviews.destroy({
      where: { id },
    });

    res.status(200).json({ success: true, message: "review deleted" });
  } catch (e) {
    return next(new HttpError(e, 400));
  }
};

module.exports = {
  addReview,
  getAllReviews,
  deleteReview,
};
