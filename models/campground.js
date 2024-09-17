const mongoose = require("mongoose")
const Schema = mongoose.Schema;
const camps = new Schema({

    title:String,
    value:Number,
    type: String
});
module.exports = mongoose.model('Campground', camps)