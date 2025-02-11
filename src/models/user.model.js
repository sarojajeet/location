
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  userlogin: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'role', // Dynamic reference based on role
  },
  role: {
    type: String,
    enum: ['1', '2', '3', '4', '5'], // Role definitions
    required: true,
  },
  otp: {
    type: String, // Stores the OTP
    default: null,
  },
  otpExpires: {
    type: Date, // Expiration time for the OTP
    default: null,
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
}, { 
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

// Adding an index for email for optimized search queries
userSchema.index({ email: 1 });

const User = mongoose.model('User', userSchema);

export default User;
