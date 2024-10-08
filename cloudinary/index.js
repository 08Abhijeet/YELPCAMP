
const {CloudinaryStorage} = require('multer-storage-cloudinary')
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});


const storage = new CloudinaryStorage({
    cloudinary,
    params:{
        folder: 'Yelpcamp',
        allowedFormats: ['jpg', 'png', 'jpeg']
    }
 
})

module.exports = {
    cloudinary,
    storage
}