const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./car_rental.db");

class Car {
    constructor(
        id,
        name,
        license_plate,
        brand,
        year,
        daily_rental_rate,
        available,
        image
    ) {
        this.id = id;
        this.name = name;
        this.license_plate = license_plate;
        this.brand = brand;
        this.year = year;
        this.daily_rental_rate = daily_rental_rate;
        this.available = available;
        this.image = image;
    }

    static create({
        name,
        license_plate,
        brand,
        year,
        daily_rental_rate,
        available,
        image,
    }) {
        return new Promise((resolve, reject) => {
            const sql = `INSERT INTO Cars (name, license_plate, brand, year, daily_rental_rate, available, image) VALUES (?, ?, ?, ?, ?, ?, ?)`;
            db.run(
                sql,
                [
                    name,
                    license_plate,
                    brand,
                    year,
                    daily_rental_rate,
                    available,
                    image,
                ],
                function (err) {
                    if (err) {
                        return reject(err);
                    }
                    resolve(
                        new Car(
                            this.lastID,
                            name,
                            license_plate,
                            brand,
                            year,
                            daily_rental_rate,
                            available,
                            image
                        )
                    );
                }
            );
        });
    }

    static findById(id) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM Cars WHERE id = ?`;
            db.get(sql, [id], (err, row) => {
                if (err) {
                    return reject(err);
                }
                if (!row) {
                    return reject(new Error("Car not found"));
                }
                resolve(
                    new Car(
                        row.id,
                        row.name,
                        row.license_plate,
                        row.brand,
                        row.year,
                        row.daily_rental_rate,
                        row.available,
                        row.image
                    )
                );
            });
        });
    }

    static update(
        id,
        {
            name,
            license_plate,
            brand,
            year,
            daily_rental_rate,
            available,
            image,
        }
    ) {
        return new Promise((resolve, reject) => {
            const sql = `UPDATE Cars SET name = ?, license_plate = ?, brand = ?, year = ?, daily_rental_rate = ?, available = ?, image = ? WHERE id = ?`;
            db.run(
                sql,
                [
                    name,
                    license_plate,
                    brand,
                    year,
                    daily_rental_rate,
                    available,
                    image,
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
            const sql = `DELETE FROM Cars WHERE id = ?`;
            db.run(sql, [id], function (err) {
                if (err) {
                    return reject(err);
                }
                resolve(this.changes);
            });
        });
    }

    static findAvailableCarsByDate(date) {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT * FROM Cars
                WHERE id NOT IN (
                    SELECT car_id FROM Rentals
                    WHERE rental_date <= ? AND return_date >= ?
                ) AND available = 1
            `;
            db.all(sql, [date, date], (err, rows) => {
                if (err) {
                    return reject(err);
                }
                resolve(
                    rows.map(
                        (row) =>
                            new Car(
                                row.id,
                                row.name,
                                row.license_plate,
                                row.brand,
                                row.year,
                                row.daily_rental_rate,
                                row.available,
                                row.image
                            )
                    )
                );
            });
        });
    }
}

module.exports = Car;
