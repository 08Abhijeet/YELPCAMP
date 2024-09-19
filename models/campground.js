const mongoose = require("mongoose")
const Schema = mongoose.Schema;
const camps = new Schema({

    title:String,
    value:Number,
    location: String
});
module.exports = mongoose.model('Campground', camps)