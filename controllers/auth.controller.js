import mongoose from "mongoose"
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { JWT_SECRET, JWT_EXPIRATION } from "../config/env.js";


/**
 * Steps to set up this authentication controller:
 * 1. Install dependencies: mongoose, bcryptjs, jsonwebtoken, and dotenv (for environment variables).
 * 2. Set up your MongoDB database and connection using mongoose.
 * 3. Create a User model in ../models/user.model.js with fields: name, email, password.
 * 4. Configure environment variables (JWT_SECRET, JWT_EXPIRATION) in ../config/env.js.
 * 5. Import and use these controller functions (signUp, signIn, signOut) in your Express routes.
 * 6. Handle errors globally in your Express app using middleware.
 */
export const signUp = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { name, email, password } = req.body;

    // Check if a user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      const error = new Error('User already exists');
      error.statusCode = 409;
      throw error;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUsers = await User.create([{ name, email, password: hashedPassword }], { session });

    const token = jwt.sign(
      { userId: newUsers[0]._id },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRATION || '1h' }
    );

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: {
        token,
        user: newUsers[0],
      }
    })
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
}

/**
 * Handles user sign-in by verifying credentials and issuing a JWT token.
 * 
 * - Checks if the user exists by email.
 * - Validates the provided password against the stored hash.
 * - If valid, generates a JWT token for authentication.
 * - Responds with the token and user data on success.
 * - Passes errors to the error handler middleware.
 */
export const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    //check if user exists
    const user = await User.findOne({ email })

    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      const error = new Error('Invalid password');
      error.statusCode = 401;
      throw error;
    }

    const token = jwt.sign(
      { userId: user._id },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRATION || '1h' }
    );

    res.status(200).json({
      success: true,
      message: 'User signed in successfully',
      data: {
        token,
        user,
      }
    });
  } catch (error) {
    next(error);
  }
}

export const signOut = async (req, res, next) => {
  
}
