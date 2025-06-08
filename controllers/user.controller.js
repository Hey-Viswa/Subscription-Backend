import User from "../models/user.model.js";

// Retrieves all users from the database and sends them in the response.
export const getUsers = async (req, res, next) => {
    try {
        const users = await User.find();

        res.status(200).json({
            success: true,
            data: users,
        })
    } catch (error) {
        next(error);
    }
}

/**
 * Retrieves a user by their ID from the database, excluding the password field.
 * 
 * - Attempts to find a user by the ID provided in the request parameters.
 * - If the user is not found, throws a 404 error.
 * - If found, responds with the user data (excluding the password) and a success message.
 * - Passes any errors to the next middleware for centralized error handling.
 *
 * @async
 * @function getUser
 * @param {Object} req - Express request object, expects `params.id` to contain the user ID.
 * @param {Object} res - Express response object, used to send the response.
 * @param {Function} next - Express next middleware function, used for error handling.
 */
export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).select("-password");
        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({
            success: true,
            data: user,
            message: "User retrieved successfully"
        })
    } catch (error) {
        next(error);
    }
}

