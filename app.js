const express = require("express");
const path = require("path")
const app = express()
const ejsMate = require('ejs-mate')
const methodoverride = require("method-override")
const catchAsync = require('./utils/catchAsync')
const mongoose = require('mongoose');
const campground = require("./models/campground");
const Reviews = require("./models/review")
const {reviewSchema} = require("./schemas.js")
const methodOverride = require("method-override");
const Joi = require("joi")
const ExpressError = require("./utils/ExpressError");


mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')

const db = mongoose.connection;
db.once("open",()=>{
    console.log("Database connected")
})

app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'))
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))


const validateReview =(req,res,next)=>{
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
app.get("/campgrounds", async(req,res)=>{
    const campgrounds = await campground.find({});
    res.render("index", {campgrounds})
    
})

app.get("/campgrounds/new", async(req,res)=>{
    res.render("new")
})

app.post("/campgrounds", validateReview, catchAsync(async(req,res,next)=>{
    
    const campgroundSchema = Joi.object({
        campgrounds: Joi.object({
            title:Joi.string().required(),
            price:Joi.number().required().min(0),
            image:Joi.string().required(),
            location:Joi.string().required(),
            description:Joi.string().required()
        }).required()
    })
    const {error}=  campgroundSchema.validate(req.body)
     if(error) {
        const msg  = error.details.map(el=> el.message).join(',')
        throw new ExpressError(msg, 404)
     }
     else{
        next()
     }
        const campgrounds= new campground (req.body.campgrounds)
        await campgrounds.save()
        res.redirect(`/campgrounds/${campgrounds._id}`)
 
   
}))
app.get('/campgrounds/:id', catchAsync(async(req,res)=>{

    const campgrounds = await campground.findById(req.params.id).populate('review')
    console.log(campgrounds)
    res.render("home" ,{campgrounds})
}))
app.get('/campgrounds/:id/edit', catchAsync(async(req,res)=>{

    const campgrounds = await campground.findById(req.params.id)
    res.render("edit" ,{campgrounds})
}))

app.put('/campgrounds/:id', catchAsync(async(req,res)=>{
    const{id} = req.params
   const campgrounds = await campground.findByIdAndUpdate(id,{...req.body.campgrounds})
   res.redirect(`/campgrounds/${campgrounds._id}`)
}))
app.delete('/campgrounds/:id', catchAsync(async(req,res)=>{
    const{id} = req.params
   const campgrounds = await campground.findByIdAndDelete(id)
   res.redirect('/campgrounds')
}))

app.post("/campgrounds/:id/reviews", catchAsync(async(req,res)=>{
    const campgrounds = await campground.findById(req.params.id)
    const review = new Reviews(req.body.review)
    campgrounds.review.push(review)
   await review.save()
   await campgrounds.save()
   res.redirect(`/campgrounds/${campgrounds._id}`)
}))
app.all('*',(req,res,next)=>{
         next(new ExpressError('Page not FOUND', 404))
})
app.use((err,req,res,next)=>{
    const {statusCode=500}= err;
    if(!err.message) err.message = "OH NO, Something went WRONG!!"
    res.status(statusCode).render('error', {err})

})
app.listen(4000, ()=>{
    console.log("Listening to the port 4000")
})