const express = require("express");
const { getHealth } = require("../controllers/healthController");

const router = express.Router();

// Health check endpoint
router.get("/", getHealth);

module.exports = router;
