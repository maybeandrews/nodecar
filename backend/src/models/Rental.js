const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./car_rental.db");

class Rental {
    constructor(
        id,
        user_id,
        car_id,
        car_name,
        rental_date,
        return_date,
        total_cost,
        status
    ) {
        this.id = id;
        this.user_id = user_id;
        this.car_id = car_id;
        this.car_name = car_name;
        this.rental_date = rental_date;
        this.return_date = return_date;
        this.total_cost = total_cost;
        this.status = status;
    }

    static create({ user_id, car_id, return_date, total_cost, status }) {
        return new Promise((resolve, reject) => {
            // Check if the user already has an active rental
            const checkActiveRentalSql = `SELECT * FROM Rentals WHERE user_id = ? AND return_date >= ?`;
            db.get(checkActiveRentalSql, [user_id, new Date()], (err, row) => {
                if (err) {
                    return reject(
                        new Error(
                            `Failed to check active rentals: ${err.message}`
                        )
                    );
                }
                if (row) {
                    return reject(
                        new Error("User already has an active rental")
                    );
                }

                // Create the new rental
                const sql = `INSERT INTO Rentals (user_id, car_id, return_date, total_cost, status) VALUES (?, ?, ?, ?, ?)`;
                db.run(
                    sql,
                    [user_id, car_id, return_date, total_cost, status],
                    function (err) {
                        if (err) {
                            return reject(
                                new Error(
                                    `Failed to create rental: ${err.message}`
                                )
                            );
                        }
                        const rental = new Rental(
                            this.lastID,
                            user_id,
                            car_id,
                            null, // car_name will be fetched later
                            new Date(),
                            return_date,
                            total_cost,
                            status
                        );
                        const updateCarSql = `UPDATE Cars SET available = 0 WHERE id = ?`;
                        db.run(updateCarSql, [car_id], function (err) {
                            if (err) {
                                return reject(
                                    new Error(
                                        `Failed to update car availability: ${err.message}`
                                    )
                                );
                            }
                            resolve(rental);
                        });
                    }
                );
            });
        });
    }

    static findById(id) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT Rentals.*, Cars.name AS car_name FROM Rentals JOIN Cars ON Rentals.car_id = Cars.id WHERE Rentals.id = ?`;
            db.get(sql, [id], (err, row) => {
                if (err) {
                    return reject(err);
                }
                if (!row) {
                    return reject(new Error("Rental not found"));
                }
                resolve(
                    new Rental(
                        row.id,
                        row.user_id,
                        row.car_id,
                        row.car_name,
                        row.rental_date,
                        row.return_date,
                        row.total_cost,
                        row.status
                    )
                );
            });
        });
    }

    static findByUserId(user_id) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT Rentals.*, Cars.name AS car_name FROM Rentals JOIN Cars ON Rentals.car_id = Cars.id WHERE Rentals.user_id = ?`;
            db.all(sql, [user_id], (err, rows) => {
                if (err) {
                    return reject(err);
                }
                const rentals = rows.map(
                    (row) =>
                        new Rental(
                            row.id,
                            row.user_id,
                            row.car_id,
                            row.car_name,
                            row.rental_date,
                            row.return_date,
                            row.total_cost,
                            row.status
                        )
                );
                resolve(rentals);
            });
        });
    }

    static update(id, { user_id, car_id, return_date, total_cost, status }) {
        return new Promise((resolve, reject) => {
            const sql = `UPDATE Rentals SET user_id = ?, car_id = ?, return_date = ?, total_cost = ?, status = ? WHERE id = ?`;
            db.run(
                sql,
                [user_id, car_id, return_date, total_cost, status, id],
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
            const sql = `DELETE FROM Rentals WHERE id = ?`;
            db.run(sql, [id], function (err) {
                if (err) {
                    return reject(err);
                }
                resolve(this.changes);
            });
        });
    }

    static returnCar(rentalId) {
        return new Promise((resolve, reject) => {
            const findRentalSql = `SELECT * FROM Rentals WHERE id = ?`;
            db.get(findRentalSql, [rentalId], (err, rental) => {
                if (err) {
                    return reject(err);
                }
                if (!rental) {
                    return reject(new Error("Rental not found"));
                }

                const deleteRentalSql = `DELETE FROM Rentals WHERE id = ?`;
                db.run(deleteRentalSql, [rentalId], function (err) {
                    if (err) {
                        return reject(err);
                    }

                    const updateCarSql = `UPDATE Cars SET available = 1 WHERE id = ?`;
                    db.run(updateCarSql, [rental.car_id], function (err) {
                        if (err) {
                            return reject(err);
                        }
                        resolve(this.changes);
                    });
                });
            });
        });
    }
}

module.exports = Rental;
