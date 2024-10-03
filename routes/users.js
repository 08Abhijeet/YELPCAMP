const express = require("express");
const router = express.Router();
const User = require("../models/user");
const users = require("../controllers/user");
const passport = require("passport");
const { storeReturnTo } = require("../middleware");
const catchAsync = require("../utils/catchAsync");

router.route("/register")
    .get(catchAsync(users.register))
    .post(catchAsync(users.newRegister));

router.route("/login")
    .get(users.login)
    .post(storeReturnTo, passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }), users.newUser);

router.get("/logout", users.logout);

module.exports = router;
