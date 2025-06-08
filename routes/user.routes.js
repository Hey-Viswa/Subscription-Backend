// Import the Router from express to create modular route handlers
import { Router } from 'express';
import authorize from '../middlewares/auth.middleware.js'
import { getUser, getUsers } from '../controllers/user.controller.js';

// Create a new router instance for user-related routes
const userRouter = Router();

/**
 * GET /
 * Fetch all users.
 * GET requests are used to retrieve data from the server.
 */
userRouter.get('/', getUsers);

/**
 * GET /:id
 * Fetch details of a specific user by ID.
 * GET requests with parameters are used to retrieve specific data.
 */
userRouter.get('/:id', authorize, getUser);

/**
 * POST /
 * Create a new user.
 * POST requests are used to send data to the server to create a new resource.
 */
// TODO : Implement user creation logic
userRouter.post('/', (req, res) => {
    res.send({ Title: 'Create a new user' });
});

/**
 * PUT /:id
 * Update an existing user by ID.
 * PUT requests are used to update existing resources on the server.
 */
// TODO : Implement user update logic
userRouter.put('/:id', (req, res) => {
    res.send({ Title: 'Update user' });
});

/**
 * DELETE /:id
 * Delete a user by ID.
 * DELETE requests are used to remove resources from the server.
 */
// TODO : Implement user deletion logic
userRouter.delete('/:id', (req, res) => {
    res.send({ Title: 'Delete user' });
});

export default userRouter;