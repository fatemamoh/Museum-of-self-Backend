const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({

  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true
  },

  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address']
  },

  password: {
    type: String,
    required: [true, 'Password is required'],
  },

  masterPin: {
    type: String,
    required: [true, 'MasterPIN is required'],
    match: [/^\d{4,6}$/, 'MasterPIN must be between 4 and 6 digits (numbers only)'],
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

  avatarPublicId: {
    type: String,
    default: "",
  },
  resetPasswordToken: String,

  resetPasswordExpires: Date,

  resetMasterPinToken: String,

  resetMasterPinExpires: Date,
},
  {
    timestamps: true
  });

userSchema.pre('save', async function () {
  if (!this.isModified('password') && !this.isModified('masterPin')) {
    return
  }

  try {
    if (this.isModified('password')) {
      this.password = await bcrypt.hash(this.password, 10);
    }
    if (this.isModified('masterPin')) {
      this.masterPin = await bcrypt.hash(this.masterPin, 10);
    }
  } catch (error) {
    throw error;
  }
});


userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.comparePin = function (candidatePin) {
  return bcrypt.compare(candidatePin, this.masterPin);
};

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    delete returnedObject.password;
    delete returnedObject.masterPin;
    delete returnedObject.avatarPublicId;
    delete returnedObject.resetPasswordToken;
    delete returnedObject.resetPasswordExpires;
    delete returnedObject.resetMasterPinToken;
    delete returnedObject.resetMasterPinExpires;
    return returnedObject;
  },
});


const User = mongoose.model('User', userSchema);
module.exports = User;
