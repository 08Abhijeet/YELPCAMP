const User = require("../models/user");
const passport = require("passport");
module.exports.register = (req, res) => {
    res.render("users/register");
  }

  module.exports.newRegister = async (req, res, next) => {
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
  }

  module.exports.login = (req, res) => {
    res.render("users/login");
  }

module.exports.newUser = async(req, res) => {
    req.flash("success", "Welcome back!!");
    const redirectUrl = res.locals.returnTo || "/campgrounds";
    delete res.locals.returnTo; // Clear returnTo after using it
    res.redirect(redirectUrl); // Redirect to the intended URL
  }
module.exports.logout = (req, res, next) => {
    req.logout(function (err) {
      if (err) {
        return next(err);
      }
  
      req.flash("success", "Good Bye!!");
      res.redirect("/campgrounds");
    });
  }