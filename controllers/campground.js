const campground = require("../models/campground");

module.exports.index = async (req, res) => {
  const campgrounds = await campground.find({});
  res.render("index", { campgrounds });
};

module.exports.renderNewForm = async (req, res) => {
  res.render("new");
};

module.exports.createNewForm = async (req, res, next) => {
  const campgrounds = new campground(req.body.campgrounds);
  campgrounds.author = req.user._id;
  await campgrounds.save();
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
  const camps = await campground.findByIdAndUpdate(id, {
    ...req.body.campgrounds,
  });
  req.flash("success", "Successfully updated the campground");
  res.redirect(`/campgrounds/${camps._id}`);
};

module.exports.deleteCampground = async (req, res) => {
  const { id } = req.params;
  await campground.findByIdAndDelete(id);
  req.flash("success", "Succesfully deleted a campground");
  res.redirect("/campgrounds");
};
