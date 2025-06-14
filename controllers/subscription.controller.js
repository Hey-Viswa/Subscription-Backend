import Subscription from '../models/subscription.model.js';

export const createSubscription = async (req, res, next) => {
    try {
      const subscription = await Subscription.create({
        ...req.body,
        user: req.user._id // Associate subscription with the authenticated user
      })
      res.status(201).json({
        success: true,
        data: subscription
      })
    } catch (error) {
        next(error);
    }
}

export const getUserSubscriptions = async (req,res, next) => {
    try {
        // check if th user is the same as the one in the token
        if(req.user.id !== req.params.id){
            const error = new Error('You are not authorized to view these subscriptions');
            error.statusCode = 401; // Unauthorized
            throw error;
        }

        // if you are authorized, get the subscriptions
        const subscriptions = await Subscription.find({ user: req.params.id });

        res.status(200).json({
            success: true,
            data: subscriptions
        })
    } catch (error) {
        next(error);
    }
}