import mongoose from 'mongoose';

const coinSchema = new mongoose.Schema({
  workerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Worker', // References the Worker model
    required: true,
    unique: true, // Each worker has one coin record
  },
  balance: {
    type: Number,
    default: 0, // Default balance is 0
  },
}, {
  timestamps: true,
});

const Coin = mongoose.model('Coin', coinSchema);
export default Coin;
