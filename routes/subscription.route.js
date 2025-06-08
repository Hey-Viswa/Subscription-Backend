// Import Router from express
import {Router} from 'express';
import authorize from '../middlewares/auth.middleware.js';
import { createSubscription, getUserSubscriptions } from '../controllers/subscription.controller.js';
// Create a new router instance for subscriptions
const subscriptionRoute = Router();

// GET / - Show subscription page
// TODO: Implement a view to show subscription options
subscriptionRoute.get('/', (req, res) => res.send(
    {
        title: 'Subscribe to Newsletter',
    }
))

// GET /:id - Get details of a specific subscription
// TODO : Implement a view to show subscription details
subscriptionRoute.get('/:id', (req, res) => res.send(
    {
        title: 'Get subscription details',
    }
))

// POST / - Create a new subscription
subscriptionRoute.post('/',authorize, createSubscription )

// PUT /:id - Update an existing subscription
// TODO: Implement a view to update subscription details
subscriptionRoute.put('/:id', (req, res) => res.send(
    {
        title: 'Update a subscription',
    }
))

// DELETE / - Delete a subscription
// TODO: Implement a view to delete a subscription  
subscriptionRoute.delete('/', (req, res) => res.send(
    {
        title: 'Delete a subscription',
    }
))

// GET /user/:id - Get all subscriptions for a user
subscriptionRoute.get('/user/:id', authorize, getUserSubscriptions)

// PUT /user/:id/cancel - Cancel a user's subscription
// TODO: Implement a view to cancel a user's subscription
subscriptionRoute.put('/user/:id/cancel', (req, res) => res.send(
    {
        title: 'Cancel user subscription',
    }
))

// PUT /upcoming-renewals - Get upcoming renewals
// TODO: Implement a view to show upcoming renewals
subscriptionRoute.put('/upcoming-renewals', (req, res) => res.send(
    {
        title: 'get upcoming renewals',
    }
))

// Export the router to be used in other parts of the app
export default subscriptionRoute;