const express = require("express");
const path = require("path")
const app = express()
const mongoose = require('mongoose');
const campground = require("./models/campground")

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')

const db = mongoose.connection;
db.once("open",()=>{
    console.log("Database connected")
})
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.get("/newcamps", (req,res)=>{
    const camp = new campground({title:"Abhijeet", value:78, type:"Hello"})
    camp.save();
    res.send(camp)
})
app.use('/', (req,res)=>{

    res.render('home')
})
app.listen(4000, ()=>{
    console.log("Listening to the port 4000")
})