import mongoose from 'mongoose';
import {DB_URI, NODE_ENV} from '../config/env.js';

// Check if the database URI is defined, throw an error if not
if (!DB_URI) {
    throw new Error('Please define DB_URI inside .env.local file');
}

// Asynchronously connects to MongoDB using Mongoose
const connectToDatabase = async () => {
    try {
        await mongoose.connect(DB_URI); // Attempt to connect to the database
        console.log(`Connected to MongoDB successfully in ${NODE_ENV} mode`);
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1); // Exit the process if connection fails
    }
}

export default connectToDatabase;