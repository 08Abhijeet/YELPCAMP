const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");
const { storeReturnTo } = require("../middleware");
const catchAsync = require("../utils/catchAsync");
router.get("/register", (req, res) => {
  res.render("users/register");
});

router.post(
  "/register",
  catchAsync(async (req, res, next) => {
    try {
      const { email, username, password } = req.body;
      const result = new User({ email, username });
      const registeredUSer = await User.register(result, password);
      req.login(registeredUSer, (err) => {
        if (err) return next(err);
        req.flash("success", "Welcome to Yelp-Camp");
        res.redirect("/campgrounds");
      });
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("register");
    }
  })
);
router.get("/login", (req, res) => {
  res.render("users/login");
});
router.post(
    "/login",
    storeReturnTo, // Ensure this middleware is correctly defined
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login", // Redirect on failure
    }),
    (req, res) => {
      req.flash("success", "Welcome back!!");
      const redirectUrl = res.locals.returnTo || "/campgrounds";
      delete res.locals.returnTo; // Clear returnTo after using it
      res.redirect(redirectUrl); // Redirect to the intended URL
    }
  );
  
router.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }

    req.flash("success", "Good Bye!!");
    res.redirect("/campgrounds");
  });
});

module.exports = router;
