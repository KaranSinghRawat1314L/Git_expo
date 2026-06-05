const express = require("express");
const router = express.Router();

const githubController = require("../controllers/github.controller");
const githubRateLimiter = require("../middlewares/rateLimiter");

router.get("/:username", githubRateLimiter, githubController.getUser);

module.exports = router;