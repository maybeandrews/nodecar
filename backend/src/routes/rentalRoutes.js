const express = require("express");
const router = express.Router();
const Rental = require("../models/Rental"); // Import your Rental model
const Car = require("../models/Car"); // Import your Car model

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

// Get all rentals for a user
router.get("/", async (req, res) => {
    const userId = req.query.user_id;

    try {
        const rentals = await Rental.findByUserId(userId);
        res.json(rentals);
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

// Delete a rental and update car availability
router.delete("/:id", async (req, res) => {
    const rentalId = req.params.id;

    try {
        await Rental.returnCar(rentalId);
        res.status(204).json(); // No content
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
