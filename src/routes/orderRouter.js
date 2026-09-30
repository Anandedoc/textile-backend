const orderController = require("../controllers/orderController");
const { auth } = require("../middleware/auth");

const router = require("express").Router();

router.get("/getOrderById/:id", orderController.getOrderById);
router.post("/create", auth, orderController.createOrder);
router.get("/getOrderByUser", auth, orderController.getOrderByUser);
router.delete("/deleteOrder/:id", orderController.deleteOrder);
router.put("/updateAddress", orderController.updateOrderAddress);
router.patch("/confirmOrder", orderController.confirmOrder);
router.patch("/dispatchOrder", orderController.dispatchOrder);
router.patch("/completeOrder/:id", orderController.completeOrder);
router.patch("/refundOrder/:id", orderController.refundOrder);

module.exports = router;
