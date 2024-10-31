const express = require("express");
const router = express.Router();
const Rental = require("../models/Rental"); // Import your Rental model

// Create a new rental
router.post("/", async (req, res) => {
    const { user_id, car_id, return_date, total_cost, status } = req.body;

    try {
        const newRental = await Rental.create({
            user_id,
            car_id,
            return_date,
            total_cost,
            status,
        });
        res.status(201).json({
            message: "Rental created successfully",
            rental: newRental,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get rental details by ID
router.get("/:id", async (req, res) => {
    const rentalId = req.params.id;

    try {
        const rental = await Rental.findById(rentalId);
        if (!rental) {
            return res.status(404).json({ message: "Rental not found" });
        }
        res.json(rental);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update rental information
router.put("/:id", async (req, res) => {
    const rentalId = req.params.id;
    const { user_id, car_id, return_date, total_cost, status } = req.body;

    try {
        const updatedRental = await Rental.update(rentalId, {
            user_id,
            car_id,
            return_date,
            total_cost,
            status,
        });
        if (updatedRental) {
            res.status(200).json(updatedRental);
        } else {
            res.status(404).json({ message: "Rental not found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a rental
router.delete("/:id", async (req, res) => {
    const rentalId = req.params.id;

    try {
        const deletedRental = await Rental.delete(rentalId);
        if (deletedRental) {
            res.status(204).json(); // No content
        } else {
            res.status(404).json({ message: "Rental not found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all rentals
router.get("/", async (req, res) => {
    try {
        const rentals = await Rental.findAll();
        res.json(rentals);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
