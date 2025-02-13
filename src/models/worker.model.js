import mongoose from 'mongoose';

// Define the schema for the worker
const workerSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
    unique: true, 
    trim: true, 
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true, 
    match: [/.+@.+\..+/, 'Please enter a valid email'], 
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  workerType: {
    type: String,
    enum: ['self worker', 'contractor', 'worker under contractor'],
    required: false,
  },
  aadhaarCardImage: {
    type: String,
    required: false,
  },
  panCardImage: {
    type: String,
    required: false,
  },
  selfie: {
    type: String,
    required: false,
  },
  verification: {
    type: Boolean,
    default: false, // Initially, the worker is not verified
  },
}, {
  timestamps: true, 
});

const Worker = mongoose.model('Worker', workerSchema);

export default Worker;
