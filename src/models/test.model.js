import mongoose from 'mongoose';

// Define the schema for the user
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true, // Ensures that no two users have the same username
    trim: true, // Removes extra whitespace
  },
  phone: {
    type: String,
    required: true,
    unique: true, // Ensures that no two users have the same phone number
    trim: true, // Removes extra whitespace
    validate: {
      validator: function(v) {
        // Check if phone number is in the correct format (e.g., +1-123-456-7890)
        return /^\+\d{1,}-\d{3}-\d{3}-\d{4}$/.test(v);
      },
      message: 'Invalid phone number format. Please use the format +1-123-456-7890'
    },
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensures that no two users have the same email
    lowercase: true, // Automatically converts email to lowercase
    match: [/.+@.+\..+/, 'Please enter a valid email'], // Validates email format
  },
  password: {
    type: String,
    required: true,
    minlength: 6, // Ensures the password has a minimum length of 6 characters
  },
}, {
  timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
});

// Create the Mongoose model
const TestUser = mongoose.model('TestUser', userSchema);

export default TestUser;
