const mongoose = require("mongoose");
const { descriptors } = require("../seeds/seedcamps");
const Schema = mongoose.Schema;
const camps = new Schema({

    title:String,
    price:Number,
    image: String,
    location: String,
    description:String,
    review: [{
        type: Schema.Types.ObjectId,
        ref:"Review"
    }]
});
module.exports = mongoose.model('Campground', camps)