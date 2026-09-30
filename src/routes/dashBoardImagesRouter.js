const dashBoardImagesController = require('../controllers/dashBoardImagesController.js');

const router = require('express').Router();

router.post('/addImage', dashBoardImagesController.addImage);
router.get('/getAllImages', dashBoardImagesController.getAllImages);
router.delete('/deleteImage/:id', dashBoardImagesController.deleteImage);
router.get('/newArrivals', dashBoardImagesController.getNewArrivals);

module.exports = router;
