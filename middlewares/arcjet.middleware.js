import aj from '../config/arcjet.js';

// Arcjet middleware for request protection and access control
const arcjetMiddleware = async (req, res, next) => {
    try {
        // Evaluate request with Arcjet and get decision
        const decision = await aj.protect(req, { requested: 1 });

        // Handle denied requests based on reason
        if(decision.isDenied()) {
            if(decision.reason.isRateLimit()) return res.status(429).json({ error: 'Rate limit exceeded' });
            if(decision.reason.isBot()) return res.status(403).json({ error: 'Bot detected' });

            return res.status(403).json({ error: 'Access denied' });
        }

        // Allow request to proceed
        next();
    } catch (error) {
        // Log and forward errors
        console.log(`Arcjet Middleware Error: ${error}`);
        next(error);
    }
}

export default arcjetMiddleware;