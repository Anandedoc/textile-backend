const userController = require("../controllers/userController");
const { auth } = require('../middleware/auth');

const router = require('express').Router();

router.post('/create', userController.createUser);

router.get('/verify_user/:id', userController.verifyUser);

router.post('/update', auth, userController.updateUser);

router.get('/profile', auth, userController.getUserProfile);

router.post('/uploadImage', userController.uploadImage);

module.exports = router;