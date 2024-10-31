const express = require("express");
const app = express();
const port = 3000;
const userRoutes = require("./routes/userRoutes");
const carRoutes = require("./routes/carRoutes");
const rentalRoutes = require("./routes/rentalRoutes");

app.use(express.json());

// Homepage route
app.get("/", (req, res) => {
    res.send("Welcome to the Car Rental System");
});

// Users API route
app.use("/users", userRoutes);

// Cars API route
app.use("/cars", carRoutes);

// Rentals API route
app.use("/rentals", rentalRoutes);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
