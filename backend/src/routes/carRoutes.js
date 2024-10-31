const express = require("express");
const router = express.Router();
const Car = require("../models/Car"); // Import your Car model
const Rental = require("../models/Rental"); // Import your Rental model

// Create a new car
router.post("/", async (req, res) => {
    const {
        name,
        license_plate,
        brand,
        year,
        daily_rental_rate,
        available,
        image,
    } = req.body;

    try {
        const newCar = await Car.create({
            name,
            license_plate,
            brand,
            year,
            daily_rental_rate,
            available,
            image,
        });
        res.status(201).json({
            message: "Car created successfully",
            car: newCar,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get car details by ID
router.get("/:id", async (req, res) => {
    const carId = req.params.id;

    try {
        const car = await Car.findById(carId);
        if (!car) {
            return res.status(404).json({ message: "Car not found" });
        }
        res.json(car);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update car information
router.put("/:id", async (req, res) => {
    const carId = req.params.id;
    const {
        name,
        license_plate,
        brand,
        year,
        daily_rental_rate,
        available,
        image,
    } = req.body;

    try {
        const updatedCar = await Car.update(carId, {
            name,
            license_plate,
            brand,
            year,
            daily_rental_rate,
            available,
            image,
        });
        if (updatedCar) {
            res.status(200).json(updatedCar);
        } else {
            res.status(404).json({ message: "Car not found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a car
router.delete("/:id", async (req, res) => {
    const carId = req.params.id;

    try {
        const deletedCar = await Car.delete(carId);
        if (deletedCar) {
            res.status(204).json(); // No content
        } else {
            res.status(404).json({ message: "Car not found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all available cars for a specific date
router.get("/available/:date", async (req, res) => {
    const date = req.params.date;

    try {
        const availableCars = await Car.findAvailableCarsByDate(date);
        res.json(availableCars);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Rent a car
router.post("/rent", async (req, res) => {
    const { user_id, car_id, return_date, total_cost } = req.body;

    try {
        const rental = await Rental.rentCar({
            user_id,
            car_id,
            return_date,
            total_cost,
        });
        res.status(201).json({
            message: "Car rented successfully",
            rental: rental,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
