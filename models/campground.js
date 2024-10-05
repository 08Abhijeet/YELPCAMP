const mongoose = require("mongoose");
const { descriptors } = require("../seeds/seedcamps");
const { campgroundSchema } = require("../schemas");
const Review = require("./review")
const Schema = mongoose.Schema;

const imageSchema = new Schema({
    url: String,
    filename: String
})
imageSchema.virtual('thumbnail').get(function(){

   return this.url.replace('/upload', '/upload/w_200')
})
const camps = new Schema({

    title:String,
    image:[imageSchema],
    geometry: {
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
      },
    price:Number,
    location: String,
    description:String,
    author:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
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