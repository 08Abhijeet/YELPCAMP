const express = require("express");
const router = express.Router({ mergeParams: true });
const reviews = require("../controllers/review.js");
const catchAsync = require("../utils/catchAsync");
const campground = require("../models/campground");
const Review = require("../models/review");
const {validateReview,isLoggedIn,isReviewAuthor,} = require("../middleware.js");

router.post("/", validateReview, isLoggedIn, catchAsync(reviews.createReview));
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, catchAsync(reviews.newReview));
module.exports = router;
