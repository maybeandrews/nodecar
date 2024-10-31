const express = require("express");
const path = require("path");
const app = express();
const port = 3000;
const userRoutes = require("./routes/userRoutes");
const carRoutes = require("./routes/carRoutes");
const rentalRoutes = require("./routes/rentalRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

app.use(express.json());

// Serve static files from the frontend directory
app.use(express.static(path.join(__dirname, "../../frontend")));

// Homepage route
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../../frontend/home.html"));
});

// Users API route
app.use("/users", userRoutes);

// Cars API route
app.use("/cars", carRoutes);

// Rentals API route
app.use("/rentals", rentalRoutes);

// Payments API route
app.use("/payments", paymentRoutes);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
