import express from 'express';
import {PORT} from "./config/env.js";
import userRouter from "./routes/user.routes.js";
import authRouter from "./routes/auth.routes.js";
import subscriptionRoute from "./routes/subscription.route.js";
import connectToDatabase from "./database/mongodb.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import cookieParser from 'cookie-parser';
import arcjetMiddleware from "./middlewares/arcjet.middleware.js"; // Import Arcjet middleware for security and bot detection

const app = express();
const initialPort = PORT || 3000; // Use configured port or fallback to 3000

app.use(express.json()); // Middleware to parse JSON bodies
app.use(express.urlencoded({ extended: false })); // Middleware to parse URL-encoded bodies
app.use(cookieParser());     // Middleware to parse cookies

app.use(arcjetMiddleware); // Use Arcjet middleware for security and bot detection

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/subscriptions', subscriptionRoute);

app.use(errorMiddleware); // Use error handling middleware

app.get("/", (req, res) => {
    res.send("Welcome to API");
});

// Function to try starting the server on different ports
function startServer(port) {
    app.listen(port, async () => {
        console.log(`Server is running on port http://localhost:${port}`);
        await connectToDatabase()
    }).on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            // Try with a different port if the current one is in use
            const newPort = parseInt(port) + 1;
            console.log(`Port ${port} is busy, trying with port ${newPort}`);
            startServer(newPort);
        } else {
            console.error('Server error:', err);
        }
    });
}

// Start the server with initial port
startServer(initialPort);
