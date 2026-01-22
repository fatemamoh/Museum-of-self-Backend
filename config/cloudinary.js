const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloudinary_url: process.env.CLOUDINARY_URL
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'museum_of_self', 
    allowed_formats: ['jpg', 'png', 'jpeg', 'mp4', 'mp3'], 
    resource_type: 'auto', 
  },
});

const upload = multer({ storage: storage });

module.exports = { cloudinary, upload };