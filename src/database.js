/**
 * Module for handling database connection
 */

const mysql = require('mysql');
// const config = require('../config/db/bank.json');

class Database {
    constructor(config) {
        console.log('Database configuration:', config);
        this.connection = mysql.createConnection(config);
    }

    async query(sql, args) {
        return new Promise((resolve, reject) => {
            this.connection.query(sql, args, (err, rows) => {
                if (err) {
                    return reject(err);
                }
                resolve(rows);
            });
        });
    }

    async close() {
        return new Promise((resolve, reject) => {
            this.connection.end(err => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    }
}

module.exports = Database;
