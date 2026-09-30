const trackingPartnersController = require("../controllers/trackingPartnersController");
const { auth } = require("../middleware/auth");

const router = require("express").Router();

router.post(
  "/addTrackingPartner",
  auth,
  trackingPartnersController.addTrackingPartner
);
router.get(
  "/getAllTrackingPartners",
  auth,
  trackingPartnersController.getAllTrackingPartners
);
router.get(
  "/singleTrackingPartner/:id",
  auth,
  trackingPartnersController.getSingleTrackingPartner
);
router.patch(
  "/updateTrackingPartner/:id",
  auth,
  trackingPartnersController.updateTrackingPartner
);
router.delete(
  "/deleteTrackingPartner/:id",
  auth,
  trackingPartnersController.deleteTrackingPartner
);

module.exports = router;
