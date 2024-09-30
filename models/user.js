const mongoose = require("mongoose");
const passport = require("passport-local-mongoose");

const Schema = mongoose.Schema;
const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
});

userSchema.plugin(passport);

module.exports = mongoose.model("User", userSchema);
