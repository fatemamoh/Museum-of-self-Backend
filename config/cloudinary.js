const cloudinary = require('cloudinary');
const multer = require('multer');
const CloudinaryStorage  = require('multer-storage-cloudinary');

cloudinary.config();

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