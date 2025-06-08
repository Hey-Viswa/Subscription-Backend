import { JWT_SECRET } from "../config/env.js"; // Import JWT secret key from environment config
import jwt from "jsonwebtoken"; // Import jsonwebtoken library for JWT operations
import User from "../models/user.model.js"; // Import User model for database queries

// Middleware function to authorize users based on JWT
const authorize = async (req, res, next) => {
    try {
        console.log("==== Auth Middleware Called ====");
        console.log("Request path:", req.path);
        console.log("Headers:", JSON.stringify(req.headers));
        
        // Initialize token variable
        let token;
        // Check if Authorization header exists and starts with 'Bearer'
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            // Extract token from Authorization header
            token = req.headers.authorization.split(' ')[1];
            console.log("Token extracted:", token ? `${token.substring(0, 20)}...` : "none");
        } else {
            console.log("Authorization header format issue:", req.headers.authorization);
        }

        // If token is not present, return 401 Unauthorized
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
                error: "No token provided"
            });
        }

        try {
            // Verify the token using JWT_SECRET
            const decoded = jwt.verify(token, JWT_SECRET);
            console.log("Token verified successfully for user:", decoded.userId);

            // Find the user in the database using the decoded userId
            const user = await User.findById(decoded.userId);
            
            // Check if user exists
            if (!user) {
                console.log("User not found in database:", decoded.userId);
                return res.status(401).json({
                    success: false,
                    message: "User not found",
                    error: "Invalid token"
                });
            }
            
            console.log("Authentication successful for user:", user.name);
            // Attach the user object to the request for downstream use
            req.user = user;
            // Call the next middleware or route handler
            next();
        } catch (jwtError) {
            console.error("JWT verification failed:", jwtError.message);
            
            // Handle specific JWT errors with appropriate messages
            if (jwtError.name === 'JsonWebTokenError') {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized",
                    error: "Invalid token format"
                });
            } else if (jwtError.name === 'TokenExpiredError') {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized",
                    error: "Token expired"
                });
            }
            
            throw jwtError;
        }
    } catch (error) {
        console.error("Auth middleware error:", error);
        // Handle errors and return 401 Unauthorized
        return res.status(401).json({
            success: false,
            message: "Unauthorized",
            error: error.message
        });
    }
}

export default authorize;
