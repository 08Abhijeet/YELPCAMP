if(process.env.NODE_ENV!== 'production')
{
  require("dotenv").config()
}

console.log(process.env.SECRET)
const express = require("express");
const path = require("path");
const app = express();
const ejsMate = require("ejs-mate");
const methodoverride = require("method-override");
const catchAsync = require("./utils/catchAsync");
const mongoose = require("mongoose");
const campground = require("./models/campground");
const flash = require("connect-flash");
const Reviews = require("./models/review");
const { reviewSchema } = require("./schemas.js");
const methodOverride = require("method-override");
const Joi = require("joi");
const ExpressError = require("./utils/ExpressError");
const session = require("express-session");
const campgrounds = require("./routes/campgrounds.js");

const passport = require("passport");
const localPassport = require("passport-local");
const review = require("./routes/reviews.js");
const User = require("./models/user.js");
const userRoute = require("./routes/users.js")
mongoose.connect("mongodb://127.0.0.1:27017/yelp-camp");

const db = mongoose.connection;
db.once("open", () => {
  console.log("Database connected");
});

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: "yourSecretKey", // Replace with a secure secret
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set to true if using HTTPS
  })
);

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new localPassport(User.authenticate()));
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())
app.use((req, res, next) => {
  console.log(req.session)
  res.locals.currentUser = req.user
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use("/", userRoute)
app.use("/campgrounds", campgrounds);
app.use("/campgrounds/:id/reviews", review);

app.all("*", (req, res, next) => {
  next(new ExpressError("Page not FOUND", 404));
});
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "OH NO, Something went WRONG!!";
  res.status(statusCode).render("error", { err });
});
app.listen(4000, () => {
  console.log("Listening to the port 4000");
});
