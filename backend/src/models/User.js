const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./car_rental.db");

class User {
    constructor(
        id,
        username,
        password,
        email,
        phone,
        address,
        is_admin,
        currently_renting
    ) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.email = email;
        this.phone = phone;
        this.address = address;
        this.is_admin = is_admin;
        this.currently_renting = currently_renting;
    }

    static create({
        username,
        password,
        email,
        phone,
        address,
        is_admin = 0,
        currently_renting = 0,
    }) {
        return new Promise((resolve, reject) => {
            const sql = `INSERT INTO Users (username, password, email, phone, address, is_admin, currently_renting) VALUES (?, ?, ?, ?, ?, ?, ?)`;
            db.run(
                sql,
                [
                    username,
                    password,
                    email,
                    phone,
                    address,
                    is_admin,
                    currently_renting,
                ],
                function (err) {
                    if (err) {
                        return reject(err);
                    }
                    resolve(
                        new User(
                            this.lastID,
                            username,
                            password,
                            email,
                            phone,
                            address,
                            is_admin,
                            currently_renting
                        )
                    );
                }
            );
        });
    }

    static findById(id) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM Users WHERE id = ?`;
            db.get(sql, [id], (err, row) => {
                if (err) {
                    return reject(err);
                }
                if (!row) {
                    return reject(new Error("User not found"));
                }
                resolve(
                    new User(
                        row.id,
                        row.username,
                        row.password,
                        row.email,
                        row.phone,
                        row.address,
                        row.is_admin,
                        row.currently_renting
                    )
                );
            });
        });
    }

    static findByUsername(username) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM Users WHERE username = ?`;
            db.get(sql, [username], (err, row) => {
                if (err) {
                    console.error("Database error:", err);
                    return reject(err);
                }
                if (!row) {
                    console.log("User not found for username:", username);
                    return resolve(null); // Resolve with null if user is not found
                }
                console.log("User found:", row);
                resolve(
                    new User(
                        row.id,
                        row.username,
                        row.password,
                        row.email,
                        row.phone,
                        row.address,
                        row.is_admin,
                        row.currently_renting
                    )
                );
            });
        });
    }

    static update(
        id,
        {
            username,
            password,
            email,
            phone,
            address,
            is_admin,
            currently_renting,
        }
    ) {
        return new Promise((resolve, reject) => {
            const sql = `UPDATE Users SET username = ?, password = ?, email = ?, phone = ?, address = ?, is_admin = ?, currently_renting = ? WHERE id = ?`;
            db.run(
                sql,
                [
                    username,
                    password,
                    email,
                    phone,
                    address,
                    is_admin,
                    currently_renting,
                    id,
                ],
                function (err) {
                    if (err) {
                        return reject(err);
                    }
                    resolve(this.changes);
                }
            );
        });
    }

    static delete(id) {
        return new Promise((resolve, reject) => {
            const sql = `DELETE FROM Users WHERE id = ?`;
            db.run(sql, [id], function (err) {
                if (err) {
                    return reject(err);
                }
                resolve(this.changes);
            });
        });
    }
}

module.exports = User;
