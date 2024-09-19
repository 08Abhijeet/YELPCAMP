const express = require("express");
const path = require("path")
const app = express()
const methodoverride = require("method-override")
const mongoose = require('mongoose');
const campground = require("./models/campground");
const methodOverride = require("method-override");

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')

const db = mongoose.connection;
db.once("open",()=>{
    console.log("Database connected")
})

app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'))
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.get("/campgrounds", async(req,res)=>{
    const campgrounds = await campground.find({});
    res.render("index", {campgrounds})
    
})

app.get("/campgrounds/new", async(req,res)=>{
    res.render("new")
})

app.post("/campgrounds", async(req,res)=>{
    const campgrounds= new campground (req.body.campgrounds)
   await campgrounds.save()
   res.redirect(`/campgrounds/${campgrounds._id}`)
})
app.get('/campgrounds/:id', async(req,res)=>{

    const campgrounds = await campground.findById(req.params.id)
    res.render("home" ,{campgrounds})
})
app.get('/campgrounds/:id/edit', async(req,res)=>{

    const campgrounds = await campground.findById(req.params.id)
    res.render("edit" ,{campgrounds})
})

app.put('/campgrounds/:id', async(req,res)=>{
    const{id} = req.params
   const campgrounds = await campground.findByIdAndUpdate(id,{...req.body.campgrounds})
   res.redirect(`/campgrounds/${campgrounds._id}`)
})
app.delete('/campgrounds/:id', async(req,res)=>{
    const{id} = req.params
   const campgrounds = await campground.findByIdAndDelete(id)
   res.redirect('/campgrounds')
})
app.listen(4000, ()=>{
    console.log("Listening to the port 4000")
})