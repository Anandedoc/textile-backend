const productTypeController = require('../controllers/productsTypesController.js');

const router = require('express').Router();

router.post('/addProductType', productTypeController.addProductType);
router.get('/getAllProductTypes', productTypeController.getAllProductTypes);
router.get('/singleProductType/:id', productTypeController.getSingleProductType);
router.put('/updateProductType/:id', productTypeController.updateProductType);
router.delete('/deleteProductType/:id', productTypeController.deleteProdutType);

module.exports = router;