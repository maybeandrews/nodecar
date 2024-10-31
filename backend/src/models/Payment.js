const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./car_rental.db");

class Payment {
    constructor(id, rental_id, amount, payment_date, payment_method) {
        this.id = id;
        this.rental_id = rental_id;
        this.amount = amount;
        this.payment_date = payment_date;
        this.payment_method = payment_method;
    }

    static create({ rental_id, amount, payment_date, payment_method }) {
        return new Promise((resolve, reject) => {
            const sql = `INSERT INTO Payments (rental_id, amount, payment_date, payment_method) VALUES (?, ?, ?, ?)`;
            db.run(
                sql,
                [rental_id, amount, payment_date, payment_method],
                function (err) {
                    if (err) {
                        return reject(err);
                    }
                    resolve(
                        new Payment(
                            this.lastID,
                            rental_id,
                            amount,
                            payment_date,
                            payment_method
                        )
                    );
                }
            );
        });
    }

    static findById(id) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM Payments WHERE id = ?`;
            db.get(sql, [id], (err, row) => {
                if (err) {
                    return reject(err);
                }
                if (!row) {
                    return reject(new Error("Payment not found"));
                }
                resolve(
                    new Payment(
                        row.id,
                        row.rental_id,
                        row.amount,
                        row.payment_date,
                        row.payment_method
                    )
                );
            });
        });
    }

    static update(id, { rental_id, amount, payment_date, payment_method }) {
        return new Promise((resolve, reject) => {
            const sql = `UPDATE Payments SET rental_id = ?, amount = ?, payment_date = ?, payment_method = ? WHERE id = ?`;
            db.run(
                sql,
                [rental_id, amount, payment_date, payment_method, id],
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
            const sql = `DELETE FROM Payments WHERE id = ?`;
            db.run(sql, [id], function (err) {
                if (err) {
                    return reject(err);
                }
                resolve(this.changes);
            });
        });
    }
}

module.exports = Payment;
