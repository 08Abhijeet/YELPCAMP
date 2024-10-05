const { cloudinary } = require("../cloudinary");
const campground = require("../models/campground");
const maptilerClient = require("@maptiler/client");
maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;

module.exports.index = async (req, res) => {
  const campgrounds = await campground.find({});
  res.render("index", { campgrounds });
};

module.exports.renderNewForm = async (req, res) => {
  res.render("new");
};

module.exports.createNewForm = async (req, res, next) => {
  const geoData = await maptilerClient.geocoding.forward(req.body.campgrounds.location, { limit: 1 });
  const campgrounds = new campground(req.body.campgrounds);
  campgrounds.geometry = geoData.features[0].geometry;
  campgrounds.image = req.files.map(f=>({url:f.path, filename:f.filename}))
  campgrounds.author = req.user._id;
  await campgrounds.save();
  console.log(campgrounds)
  req.flash("success", "Successfully made a new campground!!!");
  res.redirect(`/campgrounds/${campgrounds._id}`);
};

module.exports.createCampground = async (req, res) => {
  const campgrounds = await campground
    .findById(req.params.id)
    .populate({
      path: "review",
      populate: {
        path: "author",
      },
    })
    .populate("author");
  console.log(campgrounds);
  if (!campgrounds) {
    req.flash("error", "Cannot find the campground");
    return res.redirect("/campgrounds");
  }
  res.render("home", { campgrounds });
};

module.exports.editCampground = async (req, res) => {
  const campgrounds = await campground.findById(req.params.id);
  if (!campgrounds) {
    req.flash("error", "Cannot find the campground");
    return res.redirect("/campgrounds");
  }

  res.render("edit", { campgrounds });
};

module.exports.putCampground = async (req, res) => {
  const { id } = req.params;
  console.log(req.body)
  const camps = await campground.findByIdAndUpdate(id, {
    ...req.body.campgrounds,
  });
  const geoData = await maptilerClient.geocoding.forward(req.body.campgrounds.location, { limit: 1 });
camps.geometry = geoData.features[0].geometry;
  const imgs = req.files.map(f=>({url:f.path, filename:f.filename}))
  camps.image.push(...imgs)
  await camps.save()
  if (req.body.deleteImages) {
    for(let filename of req.body.deleteImages){
      await cloudinary.uploader.destroy(filename)
    }
    // Make sure deleteImages is an array
    const deleteImagesArray = Array.isArray(req.body.deleteImages) ? req.body.deleteImages : [req.body.deleteImages];
    await camps.updateOne({ $pull: { image: { filename: { $in: deleteImagesArray } } } });
  }
  req.flash("success", "Successfully updated the campground");
  res.redirect(`/campgrounds/${camps._id}`);
};

module.exports.deleteCampground = async (req, res) => {
  const { id } = req.params;
  await campground.findByIdAndDelete(id);
  req.flash("success", "Succesfully deleted a campground");
  res.redirect("/campgrounds");
};
