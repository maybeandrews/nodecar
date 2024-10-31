const express = require("express");
const app = express();
const port = 3000;
const userRoutes = require("./routes/userRoutes"); // Adjust path as needed
const carRoutes = require("./routes/carRoutes"); // Adjust path as needed

app.use(express.json());

// Homepage route
app.get("/", (req, res) => {
    res.send("Welcome to the Car Rental System");
});

// Users API route
app.use("/users", userRoutes); // All user routes are now under /users

// Cars API route
app.use("/cars", carRoutes); // All car routes are now under /cars

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
