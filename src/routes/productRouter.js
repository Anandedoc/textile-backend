const productController = require('../controllers/productController.js');

const router = require('express').Router();

router.post('/addProduct', productController.addProduct);
router.get('/singleProduct/:id', productController.singleProduct);
router.put('/updateProduct/:id', productController.updateProduct);
router.delete('/deleteProduct/:id', productController.deleteProduct);

module.exports = router;
