const express = require("express");
const router = express.Router();
const {storage} = require("../cloudinary")
const campgrounds = require("../controllers/campground");
const catchAsync = require("../utils/catchAsync");
const multer = require("multer")
const { isLoggedIn, isAuthorised, validateCampground } = require("../middleware");
const upload = multer({storage})

router.get("/new", isLoggedIn, catchAsync(campgrounds.renderNewForm)); // This should be before any :id routes

router.route("/")
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, upload.array('image'), catchAsync(campgrounds.createNewForm));
    
router.route("/:id")
    .get(catchAsync(campgrounds.createCampground))
    .put(isLoggedIn, isAuthorised, upload.array('image'), catchAsync(campgrounds.putCampground))
    .delete(isLoggedIn, isAuthorised, catchAsync(campgrounds.deleteCampground));

router.get("/:id/edit", isLoggedIn, isAuthorised, catchAsync(campgrounds.editCampground));

module.exports = router;
