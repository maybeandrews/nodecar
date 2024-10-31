const express = require("express");
const router = express.Router();
const Payment = require("../models/Payment"); // Import your Payment model

// Create a new payment
router.post("/", async (req, res) => {
    const { rental_id, amount, payment_date, payment_method } = req.body;

    try {
        const newPayment = await Payment.create({
            rental_id,
            amount,
            payment_date,
            payment_method,
        });
        res.status(201).json({
            message: "Payment created successfully",
            payment: newPayment,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get payment details by ID
router.get("/:id", async (req, res) => {
    const paymentId = req.params.id;

    try {
        const payment = await Payment.findById(paymentId);
        if (!payment) {
            return res.status(404).json({ message: "Payment not found" });
        }
        res.json(payment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update payment information
router.put("/:id", async (req, res) => {
    const paymentId = req.params.id;
    const { rental_id, amount, payment_date, payment_method } = req.body;

    try {
        const updatedPayment = await Payment.update(paymentId, {
            rental_id,
            amount,
            payment_date,
            payment_method,
        });
        if (updatedPayment) {
            res.status(200).json(updatedPayment);
        } else {
            res.status(404).json({ message: "Payment not found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a payment
router.delete("/:id", async (req, res) => {
    const paymentId = req.params.id;

    try {
        const deletedPayment = await Payment.delete(paymentId);
        if (deletedPayment) {
            res.status(204).json(); // No content
        } else {
            res.status(404).json({ message: "Payment not found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
