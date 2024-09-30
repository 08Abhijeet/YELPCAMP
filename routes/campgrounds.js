const express = require("express")
const router = express.Router()
const catchAsync = require('../utils/catchAsync')
const ExpressError = require("../utils/ExpressError");
const campground = require("../models/campground");
const flash = require("connect-flash")
const {isLoggedIn} = require("../middleware")
const { campgroundSchema } = require("../schemas");

const validateCampground=(req,res,next)=>{
    const {error} = campgroundSchema.validate(req.body)
    if(error) {
        const msg  = error.details.map(el=> el.message).join(',')
        throw new ExpressError(msg, 404)
     }
     else
     {
        next()
     }
}

router.get("/", async(req,res)=>{
    const campgrounds = await campground.find({});
    res.render("index", {campgrounds})
    
})

router.get("/new", isLoggedIn, async(req,res)=>{
 
    res.render("new")
})

router.post("/", catchAsync(async(req,res,next)=>{
        const campgrounds= new campground (req.body.campgrounds)
        await campgrounds.save()
        req.flash("success", "Successfully made a new campground!!!")
        res.redirect(`/campgrounds/${campgrounds._id}`)
 
   
}))
router.get('/:id', catchAsync(async(req,res)=>{

    const campgrounds = await campground.findById(req.params.id).populate('review')
      if(!campgrounds){
        req.flash("error", "Cannot find the campground")
        return res.redirect("/campgrounds")
      }
    res.render("home" ,{campgrounds})
}))
router.get('/:id/edit', isLoggedIn,catchAsync(async(req,res)=>{

    const campgrounds = await campground.findById(req.params.id)
    if(!campgrounds){
        req.flash("error", "Cannot find the campground")
        return res.redirect("/campgrounds")
      }
    res.render("edit" ,{campgrounds})
}))

router.put('/:id', isLoggedIn,catchAsync(async(req,res)=>{
    const{id} = req.params
   const campgrounds = await campground.findByIdAndUpdate(id,{...req.body.campgrounds})
   req.flash('success', "Successfully updated the campground")
   res.redirect(`/campgrounds/${campgrounds._id}`)
}))
router.delete('/:id', catchAsync(async(req,res)=>{
    const{id} = req.params
   await campground.findByIdAndDelete(id)
   req.flash('success', "Succesfully deleted a campground")
   res.redirect('/campgrounds')
}))

module.exports = router