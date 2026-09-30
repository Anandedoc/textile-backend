const productDetailsController = require('../controllers/productDetailsControllers');

const router = require('express').Router();

router.post('/addProductDetails', productDetailsController.addProductDetails);
router.post('/getAllProductDetails', productDetailsController.getAllProductDetails);
router.put('/updateProductDetails/:id', productDetailsController.updateProductDetails);
router.get('/singleProductDetails/:id', productDetailsController.getSingleProductDetails);
router.delete('/deleteProductDetails/:id', productDetailsController.deleteProdutDetails);
router.get('/search_product', productDetailsController.searchByName);

module.exports = router;