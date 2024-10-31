const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./car_rental.db");

class Rental {
    constructor(
        id,
        user_id,
        car_id,
        rental_date,
        return_date,
        total_cost,
        status
    ) {
        this.id = id;
        this.user_id = user_id;
        this.car_id = car_id;
        this.rental_date = rental_date;
        this.return_date = return_date;
        this.total_cost = total_cost;
        this.status = status;
    }

    static create({ user_id, car_id, return_date, total_cost, status }) {
        return new Promise((resolve, reject) => {
            const sql = `INSERT INTO Rentals (user_id, car_id, return_date, total_cost, status) VALUES (?, ?, ?, ?, ?)`;
            db.run(
                sql,
                [user_id, car_id, return_date, total_cost, status],
                function (err) {
                    if (err) {
                        return reject(err);
                    }
                    resolve(
                        new Rental(
                            this.lastID,
                            user_id,
                            car_id,
                            new Date(),
                            return_date,
                            total_cost,
                            status
                        )
                    );
                }
            );
        });
    }

    static findById(id) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM Rentals WHERE id = ?`;
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
                        row.rental_date,
                        row.return_date,
                        row.total_cost,
                        row.status
                    )
                );
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

    static findAll() {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM Rentals`;
            db.all(sql, [], (err, rows) => {
                if (err) {
                    return reject(err);
                }
                const rentals = rows.map(
                    (row) =>
                        new Rental(
                            row.id,
                            row.user_id,
                            row.car_id,
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

    static rentCar({ user_id, car_id, return_date, total_cost }) {
        return new Promise((resolve, reject) => {
            const sql = `INSERT INTO Rentals (user_id, car_id, return_date, total_cost, status) VALUES (?, ?, ?, ?, 'Rented')`;
            db.run(
                sql,
                [user_id, car_id, return_date, total_cost],
                function (err) {
                    if (err) {
                        return reject(err);
                    }
                    const rental = new Rental(
                        this.lastID,
                        user_id,
                        car_id,
                        new Date(),
                        return_date,
                        total_cost,
                        "Rented"
                    );
                    const updateCarSql = `UPDATE Cars SET available = 0 WHERE id = ?`;
                    db.run(updateCarSql, [car_id], function (err) {
                        if (err) {
                            return reject(err);
                        }
                        resolve(rental);
                    });
                }
            );
        });
    }
}

module.exports = Rental;
