import mongoose from 'mongoose';

const contractorSchema = new mongoose.Schema({
  workerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Worker', // The contractor's Worker ID
    required: true,
    unique: true,
  },
  totalWorkers: {
    type: Number,
    default: 0, // Default is 0 when they sign up
  },
  workers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Worker', // List of workers under this contractor
  }],
  workType: {
    type: String,
    required: true, // Type of work the contractor provides
  },
  locations: [{
    type: String,
    required: true, // Locations where they work
  }],
}, {
  timestamps: true,
});

const Contractor = mongoose.model('Contractor', contractorSchema);
export default Contractor;
