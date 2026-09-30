const  reviewController  = require("../controllers/reviewController");

const router = require('express').Router();

router.post('/addReview', reviewController.addReview);
router.get('/getAllReviews/:id', reviewController.getAllReviews);
router.delete('/deleteReview/:id', reviewController.deleteReview);

module.exports = router;