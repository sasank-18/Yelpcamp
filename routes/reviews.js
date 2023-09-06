const express= require('express');
const router= express.Router({mergeParams:true});
const Review= require('../models/review');
const Campground= require('../models/campground');
const catchAsync = require('../utils/catchAsync');
const { reviewSchema} = require('../schemas.js');
const ExpressError= require('../utils/ExpressError');
const {isLoggedIn,isReviewAuthor,validateReview}= require('../middleware');
const reviews= require('../controllers/reviews')




router.post('/',isLoggedIn,isReviewAuthor,validateReview, catchAsync(reviews.createReview));

// pull operator removes from an existing array all instance of value or vlaues
// that match a specified conditon 
router.delete('/:reviewId',isLoggedIn,isReviewAuthor,catchAsync(reviews.deleteReview))


module.exports= router;