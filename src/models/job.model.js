import mongoose from 'mongoose';

// Define the schema for the Job
const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true, // Removes extra whitespace
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TestUser', // References the user who created the job
    required: true,
  },
  location: {
    type: {
      type: String, // GeoJSON format
      enum: ['Point'], // Ensures it is a GeoJSON point
      required: true,
    },
    coordinates: {
      type: [Number], // Array of [longitude, latitude]
      required: true,
    },
  },
  status: {
    type: String,
    enum: ['open', 'accepted', 'completed'], 
    default: 'open',
  },
  workerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Worker', 
  },
}, {
  timestamps: true, 
});
jobSchema.index({ location: '2dsphere' });

const Job = mongoose.model('Job', jobSchema);

export default Job;
