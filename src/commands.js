/**
 * Module for handling commands
 */

// const { createConnection } = require("mysql");

// const connection = require('./database.js');

async function moveMoney(db) {
    let sql = `
        START TRANSACTION;
        
        UPDATE account
        SET balance = balance + 1.5
        WHERE id = "2222";
        
        UPDATE account
        SET balance = balance - 1.5
        WHERE id = "1111";
        
        COMMIT;
    `;

    try {
        await db.query(sql);
        console.log("Transaction complete");
    } catch (err) {
        console.error("Error during transaction:", err);
    }
}

async function showBalance(db) {
    // Rensa konsolfönstret
    console.clear();

    // Hämta balansen för alla konton från databasen
    let sql = `
        SELECT * FROM account;
    `;

    try {
        // Utför SQL-frågan
        let result = await db.query(sql);

        // Skriv ut tabellen med kontobalans
        console.table(result);
    } catch (err) {
        console.error("Error fetching account balance:", err);
    }
}

module.exports = { moveMoney, showBalance };
