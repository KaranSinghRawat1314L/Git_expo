const rateLimit = require("express-rate-limit");

const githubRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute

  max: 20, // 20 requests per minute per IP

  message: {
    success: false,
    message: "Too many requests. Please try again later."
  },

  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = githubRateLimiter;