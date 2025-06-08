// Custom error handling middleware for Express
const errorMiddleware = (err, req, res, next) => {
    try {
        // Create a shallow copy of the error object
        let error = { ...err };
        // Ensure the error message is preserved
        error.message = err.message;

        // Log the original error for debugging
        console.error(err);

        // Handle invalid MongoDB ObjectId errors (e.g., malformed IDs)
        if(err.name === 'CastError') {
            const message = `Resource not found. Invalid: ${err.path}`;
            error = new Error(message);
            error.statusCode = 404;
        }

        // Handle duplicate key errors from MongoDB (e.g., unique fields)
        if(err.code === 11000) {
            const message = `Duplicate field value entered: ${Object.keys(err.keyValue).join(', ')}`;
            error = new Error(message);
            error.statusCode = 400; 
        }

        // Handle Mongoose validation errors (e.g., required fields missing)
        if(err.name === 'ValidationError') {
            // Collect all validation error messages
            const message = Object.values(err.errors).map(val => val.message).join(', ');
            error = new Error(message);
            error.statusCode = 400;
        }

        // Send the error response to the client
        res.status(error.statusCode || 500).json({
            success: false,
            error: error.message || 'Server Error',
        })
    } catch (error) {
        // Pass any errors in the error handler itself to the next middleware
        next(error);
    }
};

export default errorMiddleware;
// This middleware should be used after all routes and other middlewares