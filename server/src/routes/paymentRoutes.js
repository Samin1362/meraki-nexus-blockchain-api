const express = require("express");
const { validatePaymentRequest } = require("../middleware/validation");
const { processPayment } = require("../controllers/paymentController");

const router = express.Router();

// Payment endpoint
router.post("/", validatePaymentRequest, processPayment);

module.exports = router;
