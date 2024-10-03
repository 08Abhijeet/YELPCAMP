const Review = require("../models/review");
const campground = require("../models/campground");
module.exports.createReview = async (req, res) => {
  const campgrounds = await campground.findById(req.params.id);
  const review = new Review(req.body.review);
  review.author = req.user._id;
  campgrounds.review.push(review);
  await review.save();
  await campgrounds.save();
  req.flash("success", "Created a new review");
  res.redirect(`/campgrounds/${campgrounds._id}`);
};

module.exports.newReview = async (req, res) => {
  const { id, reviewId } = req.params;
  const ID = await campground.findByIdAndUpdate(id, {
    $pull: { review: reviewId },
  });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Succesfully deleted the review");
  res.redirect(`/campgrounds/${id}`);
};
