const express = require('express');
const router = express.Router();
const Memory = require('../models/memory');
const { upload } = require('../config/cloudinary');