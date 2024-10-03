const { campgroundSchema } = require("./schemas.js");
const ExpressError = require("./utils/ExpressError");
const Review = require("./models/review.js")
const { reviewSchema } = require("./schemas.js");
const campground = require("./models/campground");
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "You must login to continue!");
    return res.redirect("/login");
  }
  next();
};
module.exports.validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 404);
  } else {
    next();
  }
};
module.exports.storeReturnTo = (req, res, next) => {
  if (req.session.returnTo) {
    res.locals.returnTo = req.session.returnTo;
  }
  next();
};

module.exports.isAuthorised = async (req, res, next) => {
  const { id } = req.params;
  const campgrounds = await campground.findById(id);
  if (!campgrounds.author.equals(req.user._id)) {
    req.flash("error", "You don't have permission to do that!");
    return res.redirect(`/campgrounds/${id}`);
  }
  next(); // This ensures the flow continues if authorized
};

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    
    if (!review) {
        req.flash("error", "Review not found!");
        return res.redirect(`/campgrounds/${id}`);
    }
    
    if (!review.author.equals(req.user._id)) {
        req.flash("error", "You don't have permission to do that!");
        return res.redirect(`/campgrounds/${id}`);
    }

    next();
};

module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 404);
  } else {
    next();
  }
};
