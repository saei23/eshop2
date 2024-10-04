/**
 * Module for handling commands
 */

// const { createConnection } = require("mysql");

// const connection = require('./database.js');

"use strict";

module.exports = {
    about: about,
    log: log,
    showProducts: showProducts,
    showShelf: showShelf,
    inv: inv,
    filterInv: filterInv,
    addProducts: addProducts,
    deleteProducts: deleteProducts
};

const mysql  = require("promise-mysql");
const config = require("../config/db/eshop.json");
let db;

/**
 * Main function.
 * @async
 * @returns void
 */
(async function() {
    db = await mysql.createConnection(config);

    process.on("exit", () => {
        db.end();
    });
})();

/**
 *
 * @param {*} db
 * @returns
 */
async function about(db) {
    let sql = `CALL about()`;
    let res;

    res = await db.query(sql);
    return res[0];
}

/**
 *
 * @param {*} db
 * @param {*} number
 * @returns
 */
async function log(db, number) {
    let sql = `CALL show_log(?)`;
    let res;

    res = await db.query(sql, [number]);
    return res[0];
}

/**
 *
 * @param {*} db
 * @returns
 */
async function showProducts(db) {
    let sql = `CALL show_all_products()`;
    let res;

    res = await db.query(sql);
    return res[0];
}

/**
 *
 * @param {*} db
 * @returns
 */
async function showShelf(db) {
    let sql = `CALL show_shelves()`;
    let res;

    res = await db.query(sql);
    return res[0];
}

/**
 *
 * @param {*} db
 * @returns
 */
async function inv(db) {
    let sql = `CALL show_inventory()`;
    let res;

    res = await db.query(sql);
    return res[0];
}

/**
 *
 * @param {*} db
 * @param {*} str
 * @returns
 */
async function filterInv(db, str) {
    let sql = `CALL filter_inventory(?)`;
    let res;

    res = await db.query(sql, [str]);
    return res[0];
}

/**
 *
 * @param {*} db
 * @param {*} productID
 * @param {*} shelf
 * @param {*} quantity
 * @returns
 */
async function addProducts(db, productID, shelf, quantity) {
    let sql = `CALL add_to_inventory(?, ?, ?)`;

    try {
        await db.query(sql, [productID, shelf, quantity]);
        return "Produkterna har lagts till i lagret.";
    } catch (error) {
        console.error("Ett fel uppstod när produkterna skulle läggas till i lagret:", error);
        return "Misslyckades med att lägga till produkter i lagret.";
    }
}

/**
 *
 * @param {*} db
 * @param {*} productID
 * @param {*} shelf
 * @param {*} quantity
 * @returns
 */
async function deleteProducts(db, productID, shelf, quantity) {
    let sql = `CALL delete_from_inventory(?, ?, ?)`;

    try {
        await db.query(sql, [productID, shelf, quantity]);
        return "Produkterna har tagits bort från lagret.";
    } catch (error) {
        console.error("Ett fel uppstod när produkterna skulle tas bort från lagret:", error);
        return "Misslyckades med att ta bort produkter från lagret.";
    }
}
