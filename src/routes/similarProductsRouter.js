const similarProductController = require("../controllers/similarProductsController");
const { auth } = require("../middleware/auth");

const router = require("express").Router();

router.post("/add_image", auth, similarProductController.addImage);
router.get("/getSimilarProductId/:id", auth, similarProductController.getSimilarProductId)

module.exports = router;
