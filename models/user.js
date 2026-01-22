const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema({

  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  masterPin: {
    type: String,
    required: true,
  },

  bio: {
    type: String,
    default: "",
  },

  location: {
    type: String,
    default: "",
  },

  avatarUrl: {
    type: String,
    default: "",
  },

  avatarPublicId :{
     type: String,
    default: "",
  },
});

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  if (this.isModified('masterPin')) {
    this.masterPin = await bcrypt.hash(this.masterPin, 10);
  }
  next();
});

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    delete returnedObject.password;
    delete returnedObject.masterPin;
  },
});


const User = mongoose.model('User', userSchema);
module.exports = User;
