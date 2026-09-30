const authController = require("../controllers/authController");
const { auth } = require("../middleware/auth");

const router = require('express').Router();

router.post('/login', authController.login);

router.get('/logout', auth, authController.logout);

router.post('/forget_password', authController.forgetPassword);

router.post('/reset_password/:id', authController.resetPassword);

module.exports = router;
