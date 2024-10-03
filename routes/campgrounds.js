const express = require("express");
const router = express.Router();
const campgrounds = require("../controllers/campground");
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, isAuthorised, validateCampground } = require("../middleware");const multer  = require('multer')
const upload = multer({dest:"uploads/"})

router.get("/new", isLoggedIn, catchAsync(campgrounds.renderNewForm)); // This should be before any :id routes

router.route("/")
    .get(catchAsync(campgrounds.index))
    // .post(isLoggedIn, catchAsync(campgrounds.createNewForm));
    .post(upload.array('image'),(req,res)=>{
        console.log(req.body, req.files)
        res.send("IT WORKED")
    })

router.route("/:id")
    .get(catchAsync(campgrounds.createCampground))
    .put(isLoggedIn, isAuthorised, catchAsync(campgrounds.putCampground))
    .delete(isLoggedIn, isAuthorised, catchAsync(campgrounds.deleteCampground));

router.get("/:id/edit", isLoggedIn, isAuthorised, catchAsync(campgrounds.editCampground));

module.exports = router;
