
import mongoose from 'mongoose';

/**
 * Mongoose schema for the User model.
 *
 * Defines the structure of user documents in MongoDB, including:
 * - `name`: User's name (required, trimmed, 3-50 characters).
 * - `email`: User's email address (required, unique, trimmed, lowercase, must match email format).
 * - `password`: User's password (required, minimum 6 characters).
 * 
 * Automatically manages `createdAt` and `updatedAt` timestamps.
 */
const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'User name is required'],
            trim: true,
            minlength: [3, 'User name must be at least 3 characters long'],
            maxlength: [50, 'User name must be at most 50 characters long']
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            trim: true,
            lowercase: true,
            match: [
                /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                'Please fill a valid email address'
            ]
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [6, 'Password must be at least 6 characters long'],
        }
    }, { timestamps: true }
)

const User = mongoose.model('User', userSchema);
export default User;