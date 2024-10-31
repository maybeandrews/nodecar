const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./car_rental.db", (err) => {
    if (err) {
        console.error("Error connecting to the database", err.message);
    } else {
        console.log("Connected to the SQLite database");
    }
});

// Create tables
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS Users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        phone TEXT,
        address TEXT,
        is_admin BOOLEAN DEFAULT 0,          -- Field to check if the user is an admin
        currently_renting BOOLEAN DEFAULT 0   -- Field to check if the user is currently renting a car
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS Cars (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        license_plate TEXT UNIQUE NOT NULL,
        brand TEXT NOT NULL,
        year INTEGER NOT NULL,
        daily_rental_rate REAL NOT NULL,
        available BOOLEAN DEFAULT 1,
        image TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS Rentals (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,                      -- Change from customer_id to user_id
        car_id INTEGER,
        rental_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        return_date DATETIME NOT NULL,
        total_cost REAL NOT NULL,
        status TEXT DEFAULT 'Pending',
        FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE, -- Update the foreign key
        FOREIGN KEY (car_id) REFERENCES Cars(id) ON DELETE CASCADE
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS Payments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        rental_id INTEGER,
        amount REAL NOT NULL,
        payment_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        payment_method TEXT,
        FOREIGN KEY (rental_id) REFERENCES Rentals(id) ON DELETE CASCADE
    )`);
});

module.exports = db; // Export the database connection
