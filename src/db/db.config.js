import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 8000 , {
  
      tls: true, // Enable TLS (SSL)
      tlsAllowInvalidCertificates: true, // Allow self-signed certs (for testing)
    });
    console.log('MongoDB connected successfully');
   
  } catch (error) {
    console.error('MongoDB connection failed', error);
    process.exit(1); // Exit process with failure
  }
  
};

export { mongoose, connectDB };
