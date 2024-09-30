const mongoose = require("mongoose");
const { descriptors } = require("../seeds/seedcamps");
const { campgroundSchema } = require("../schemas");
const Review = require("./review")
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

camps.post('findOneAndDelete', async function(doc) {
    
    if(doc){
        await Review.deleteMany({
            _id:{
                   $in: doc.review
            }
        })
        
    }
   

});


module.exports = mongoose.model('Campground', camps)