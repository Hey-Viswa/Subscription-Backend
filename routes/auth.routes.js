import {Router} from 'express';
import jwt from "jsonwebtoken";
import { signUp,signOut,signIn } from '../controllers/auth.controller.js';
import authorize from '../middlewares/auth.middleware.js';
import { JWT_SECRET } from "../config/env.js";

/**
 * Auth routes for sign-up, sign-in, and sign-out.
 */
const authRouter = Router();

/** Signup route */
authRouter.post('/sign-up', signUp);

/** Sign in route */
authRouter.post('/sign-in', signIn);

/** Sign-out route */
authRouter.post('/sign-out', signOut);

/** Test auth route - helps debug token issues */
authRouter.get('/test-auth', authorize, (req, res) => {
    res.status(200).json({
        success: true,
        message: "Your token is valid!",
        user: {
            id: req.user._id,
            name: req.user.name,
            email: req.user.email
        }
    });
});

/** Debug route - DO NOT USE IN PRODUCTION */
authRouter.get('/debug-token', (req, res) => {
    try {
        const token = req.query.token;
        
        if (!token) {
            return res.status(400).json({
                success: false,
                message: "No token provided in query parameter",
                note: "Add ?token=YOUR_TOKEN_HERE to the URL"
            });
        }
        
        console.log("JWT_SECRET:", JWT_SECRET ? "Is defined" : "Is undefined");
        
        // Try to verify the token and show its contents
        const decoded = jwt.verify(token, JWT_SECRET);
        
        return res.status(200).json({
            success: true,
            message: "Token is valid!",
            tokenInfo: {
                userId: decoded.userId,
                issuedAt: new Date(decoded.iat * 1000).toISOString(),
                expiresAt: new Date(decoded.exp * 1000).toISOString(),
                timeLeft: Math.floor((decoded.exp - Date.now()/1000) / 60) + " minutes"
            }
        });
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Token verification failed",
            error: error.message,
            errorType: error.name
        });
    }
});

export default authRouter;