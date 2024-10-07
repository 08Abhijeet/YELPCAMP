const User = require("../models/user");
const passport = require("passport");

module.exports.register = (req, res) => {
    res.render("users/register");
}

module.exports.newRegister = async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);

        // Ensure req.login finishes before redirect
        req.login(registeredUser, (err) => {
            if (err) return next(err); // Return to avoid further execution
            req.flash("success", "Welcome to Yelp-Camp");
            return res.redirect("/campgrounds"); // Return after response
        });
    } catch (e) {
        req.flash("error", e.message);
        return res.redirect("/register"); // Return after response
    }
}

module.exports.login = (req, res) => {
    res.render("users/login");
}

module.exports.newUser = (req, res) => {
    req.flash("success", "Welcome back!!");
    const redirectUrl = res.locals.returnTo || "/campgrounds";
    delete res.locals.returnTo; // Clear returnTo after using it
    return res.redirect(redirectUrl); // Return after response
}

module.exports.logout = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err); // Return if there's an error
        }
        req.flash("success", "Good Bye!!");
        return res.redirect("/campgrounds"); // Return after response
    });
}
