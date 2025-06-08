import arcjet, { shield, detectBot, tokenBucket } from "@arcjet/node"; // Import Arcjet core and rules
// REMOVE this line:
// import { isSpoofedBot } from "@arcjet/inspect";
// import express from "express"; // Import Express framework

// const app = express(); // Create Express app
// const port = 5500; // Set server port

const aj = arcjet({
    key: process.env.ARCJET_API_KEY, // Arcjet API key from environment
    characteristics: ["ip.src"], // Use source IP as characteristic
    rules: [
        shield({ mode: "LIVE" }), // Basic protection rule
        // detectBot({
        //     mode: "LIVE",
        //     allow: ["CATEGORY:SEARCH_ENGINE"],
        // }),
        tokenBucket({
            mode: "LIVE",
            refillRate: 5, // 5 tokens per interval
            interval: 10, // Interval in seconds
            capacity: 10, // Max tokens
        }),
    ],
});

// app.get("/", async (req, res) => { // Handle GET requests to "/"
//     const decision = await aj.protect(req, { requested: 5 }); // Apply Arcjet protection
//     console.log("Arcjet decision", decision);

//     if (decision.isDenied()) { // If request is denied
//         if (decision.reason.isRateLimit()) { // Denied due to rate limiting
//             res.writeHead(429, { "Content-Type": "application/json" });
//             res.end(JSON.stringify({ error: "Too Many Requests" }));
//         } else if (decision.reason.isBot()) { // Denied due to bot detection
//             res.writeHead(403, { "Content-Type": "application/json" });
//             res.end(JSON.stringify({ error: "No bots allowed" }));
//         } else { // Denied for other reasons
//             res.writeHead(403, { "Content-Type": "application/json" });
//             res.end(JSON.stringify({ error: "Forbidden" }));
//         }
//     } else {
//         res.writeHead(200, { "Content-Type": "application/json" }); // Success response
//         res.end(JSON.stringify({ message: "Hello World" }));
//     }
// });

// app.listen(port, () => { // Start server
//     console.log(`Example app listening on port ${port}`);
// });

export default aj; // Export Arcjet instance