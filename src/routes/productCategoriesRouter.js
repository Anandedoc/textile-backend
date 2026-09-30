/** @format */

const productCategoriesController = require("../controllers/productCategoriesController");

const router = require("express").Router();

router.post(
  "/addProductCategory",
  productCategoriesController.addProductCategory
);
router.get(
  "/getAllProductCategories/:id",
  productCategoriesController.getAllProductCategories
);
router.put(
  "/updateProductCategory/:id",
  productCategoriesController.updateProductCategory
);
router.delete(
  "/deleteProductCategory/:id",
  productCategoriesController.deleteProductCategory
);

module.exports = router;
