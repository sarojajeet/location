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
  workerType: {
    type: String,
    enum: ['self worker', 'contractor', 'worker under contractor'],
    required: false,
  },
  contractorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Worker', // Links to a contractor if workerType is 'worker under contractor'
    required: function() { return this.workerType === 'worker under contractor'; }
  },
  aadhaarCardImage: String,
  panCardImage: String,
  selfie: String,
  referralCode: {
    type: String,
    unique: true,
    trim: true,
  },
  verification: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true, 
});

const Worker = mongoose.model('Worker', workerSchema);
export default Worker;
