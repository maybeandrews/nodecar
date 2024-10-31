const express = require("express");
const router = express.Router();
const User = require("../models/User"); // Import your User model

// Register a new user
router.post("/register", async (req, res) => {
    const { username, password, email, phone, address } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findByUsername(username);
        if (existingUser) {
            return res.status(400).json({ message: "Username already exists" });
        }

        // Create the new user
        await User.create({ username, password, email, phone, address });
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Login a user
router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findByUsername(username);
        if (!user || user.password !== password) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        res.json({
            message: "Login successful",
            userId: user.id,
            isAdmin: user.is_admin,
        });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ error: error.message });
    }
});

// Get user details by ID
router.get("/:id", async (req, res) => {
    const userId = req.params.id;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (error) {
        console.error("Error fetching user by ID:", error);
        res.status(500).json({ error: error.message });
    }
});

// Update user information
router.put("/:id", async (req, res) => {
    const userId = req.params.id;
    const { username, email, phone, address } = req.body;

    try {
        const updatedUser = await User.update(userId, {
            username,
            email,
            phone,
            address,
        });
        if (updatedUser) {
            res.status(200).json(updatedUser);
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a user
router.delete("/:id", async (req, res) => {
    const userId = req.params.id;

    try {
        const deletedUser = await User.delete(userId);
        if (deletedUser) {
            res.status(204).json(); // No content
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Export the router
module.exports = router;
