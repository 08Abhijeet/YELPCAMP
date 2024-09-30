const express = require("express")
const router = express.Router({mergeParams:true})
const {reviewSchema} = require("../schemas.js")
const catchAsync = require('../utils/catchAsync')
const campground = require("../models/campground");
const Reviews = require("../models/review")
const ExpressError = require("../utils/ExpressError");

const validateReview=(req,res,next)=>{
    const {error} = reviewSchema.validate(req.body)
    if(error) {
        const msg  = error.details.map(el=> el.message).join(',')
        throw new ExpressError(msg, 404)
     }
     else
     {
        next()
     }
}
router.post("/",validateReview, catchAsync(async(req,res)=>{
    const campgrounds = await campground.findById(req.params.id)
    const review = new Reviews(req.body.review)
    campgrounds.review.push(review)
   await review.save()
   await campgrounds.save()
   req.flash('success', "Created a new review")
   res.redirect(`/campgrounds/${campgrounds._id}`)
}))

router.delete("/:reviewId", catchAsync(async(req,res)=>{
     const {id, reviewId} = req.params;
   const ID =  await   campground.findByIdAndUpdate(id, {$pull: {review: reviewId}})
    await Reviews.findByIdAndDelete(reviewId)
    req.flash('success', "Succesfully deleted the review")
     res.redirect(`/campgrounds/${id}`)

}))
module.exports = router;