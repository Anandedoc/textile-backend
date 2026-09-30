/** @format */

const db = require("../models");
const HttpError = require("../models/httpErrorModel");

//Create Main Model

const TrackingPartners = db.tracking_partners;

//1.Add TrackingPartner

const addTrackingPartner = async (req, res, next) => {
  try {
    let detail = {
      name: req.body.name,
      url: req.body.url,
      createdBy: req.user.id,
    };
    await TrackingPartners.create(detail);

    res.status(201).json({
      success: true,
      message: "Tracking Partner AddedSuccessfully",
      data: detail,
    });
  } catch (error) {
    return next(new HttpError(error?.message || "Server error", 400));
  }
};

//2.Get All TrackingPartners

const getAllTrackingPartners = async (req, res, next) => {
  const allTrackingPartners = await TrackingPartners.findAll({});
  res.status(200).json({ success: true, data: allTrackingPartners });
};

//3.Get Single TrackingPartner

const getSingleTrackingPartner = async (req, res, next) => {
  let id = req.params.id;

  const trackingPartner = await TrackingPartners.findOne({ where: { id } });

  res.status(200).json({ success: true, data: trackingPartner });
};

const updateTrackingPartner = async (req, res, next) => {
  const id = parseInt(req.params.id, 10);
  const url = req.body.url;
  const [updatedTrackingPartner] = await TrackingPartners.update(
    { url },
    { where: { id } }
  );
  if (!updatedTrackingPartner) {
    return next(new HttpError("Tracking Partners is not updated", 400));
  }
  res
    .status(200)
    .json({ success: true, message: "Tracking Partner Updated Successfully" });
};

// 5.Delete TrackingPartner

const deleteTrackingPartner = async (req, res, next) => {
  const id = parseInt(req.params.id, 10);
  try {
    await TrackingPartners.destroy({ where: { id } });
    res
      .status(200)
      .json({ success: true, message: "TrackingPartner Deleted Successfully" });
  } catch (error) {
    console.log(error);
    return next(new HttpError(error.message || "Server not reachable", 500));
  }
};

module.exports = {
  addTrackingPartner,
  updateTrackingPartner,
  getSingleTrackingPartner,
  getAllTrackingPartners,
  deleteTrackingPartner,
};
