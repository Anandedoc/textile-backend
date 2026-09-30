/** @format */

const shoppingCartController = require("../controllers/shoppingCartController");
const { auth } = require("../middleware/auth");

const router = require('express').Router();

router.get('/list', auth, shoppingCartController.getShoppingCartList);
router.post('/add', auth, shoppingCartController.createShoppingCart);
router.put('/update', auth, shoppingCartController.updateShoppingCart);

module.exports = router;

