/**
 * A module exporting functions to access the bank database.
 */
"use strict";

module.exports = {
    showCategory: showCategory,
    showProduct: showProduct,
    showAllProducts: showAllProducts,
    createProduct: createProduct,
    editProduct: editProduct,
    deleteProduct: deleteProduct,
    showAllCustomers: showAllCustomers,
    showAllOrders: showAllOrders,
    createOrder: createOrder,
    addProductToOrder: addProductToOrder,
    completeOrder: completeOrder,
    getOrderDetails: getOrderDetails,
    getOrderStatus: getOrderStatus
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
 * Show info about category.
 *
 * @async
 * @param {String} id A id of the category.
 *
 * @returns {RowDataPacket} Resultset from the query.
 */
async function showCategory(id) {
    let sql = `CALL show_category();`;
    let res;

    res = await db.query(sql, [id]);
    return res[0];
}


/**
 * Show info about product.
 *
 * @async
 *
 * @returns {RowDataPacket} Resultset from the query.
 */
async function showProduct(id) {
    let sql = `CALL show_product(?);`;
    let res;

    res = await db.query(sql, [id]);

    console.log(res);
    console.info(`SQL: ${sql} got ${res.length} rows.`);

    return res[0];
}


/**
 * Show info about product.
 *
 * @async
 *
 * @returns {RowDataPacket} Resultset from the query.
 */
async function showAllProducts(id) {
    let sql = `CALL show_all_products();`;
    let res;

    res = await db.query(sql, [id]);

    console.log(res);
    console.info(`SQL: ${sql} got ${res.length} rows.`);

    return res[0];
}


/**
 *
 * @param {*} id
 * @param {*} name
 * @param {*} price
 * @param {*} description
 * @param {*} manufacturer
 * @param {*} categoryID
 * @returns
 */
async function createProduct(id, name, price, description, manufacturer, categoryID) {
    let sql = `CALL create_product(?, ?, ?, ?, ?, ?);`;
    let res;

    res = await db.query(sql, [id, name, price, description, manufacturer, categoryID]);
    return res[0];
}

/**
 *
 * @param {*} name
 * @param {*} price
 * @param {*} description
 * @returns
 */
async function editProduct(id, name, price, description) {
    let sql = `CALL edit_product(?, ?, ?, ?);`;
    let res;

    res = await db.query(sql, [id, name, price, description]);
    return res[0];
}

/**
 *
 * @param {*} id
 * @returns
 */
async function deleteProduct(id) {
    let sql = `CALL delete_product(?);`;
    let res;

    res = await db.query(sql, [id]);
    return res[0];
}

/**
 * 
 * @returns 
 */
async function showAllCustomers() {
    let sql = `CALL show_all_customers();`;
    let res;

    res = await db.query(sql);

    console.log(res);
    console.info(`SQL: ${sql} got ${res.length} rows.`);

    return res[0];
}

/**
 * 
 * @returns 
 */
async function showAllOrders() {
    let sql = `CALL show_all_orders();`;
    let res;

    res = await db.query(sql);

    console.log(res);
    console.info(`SQL: ${sql} got ${res.length} rows.`);

    return res[0];
}

// /**
//  * 
//  * @param {*} kundID 
//  * @returns 
//  */
// async function createOrder(kundID) {
//     let sql = `INSERT INTO orders (kundID, orderdatum, status) VALUES (?, CURDATE(), 'Skapad')`;
//     let res;

//     res = await db.query(sql, [kundID]);

//     console.log(`Order created for customer ID ${kundID} with ID ${res.insertId}`);
//     return res.insertId;
// }

/**
 * 
 * @param {*} kundID 
 * @returns 
 */
async function createOrder(kundID) {
    
    const orderdatum = new Date();
    const sqlInsertOrder = `
        INSERT INTO orders (kundID, orderdatum, status) 
        VALUES (?, ?, 'Pending')
    `;

    try {
        const result = await db.query(sqlInsertOrder, [kundID, orderdatum]);
        const orderID = result.insertId; // MySQL-specifikt för att hämta senaste insatta ID
        // console.log("SQL result:", result);

        return orderID;
    } catch (err) {
        console.error("Error creating order:", err.message);
        throw err;
    }
}



/**
 * 
 * @param {*} orderID 
 * @param {*} produktID 
 * @param {*} antal 
 * @returns 
 */
async function addProductToOrder(orderID, produktID, antal) {
    // Kontrollera lagerstatus
    let checkStockSql = `SELECT lager FROM produkt WHERE produktID = ?`;
    let stockResult = await db.query(checkStockSql, [produktID]);
    let stock = stockResult[0].lager;

    if (antal > stock) {
        throw new Error('Not enough stock for product ID ' + produktID);
    }

    let sql = `INSERT INTO orderrad (orderID, produktID, antal, pris)
    SELECT ?, produktID, ?, pris FROM produkt WHERE produktID = ?`;
    let res = await db.query(sql, [orderID, antal, produktID]);
    console.log(res);
    
    console.log(`Product ID ${produktID} added to order ID ${orderID}`);
    return res.affectedRows;
}

// /**
//  * Lägg till en produkt i en order.
//  * @param {*} orderID - Orderns ID
//  * @param {*} produktID - Produktens ID
//  * @param {*} antal - Antal av produkten
//  * @returns - Antal påverkade rader
//  */
// async function addProductToOrder(orderID, produktID, antal) {
//     try {
//         // Kontrollera om produkten finns
//         let checkProductSql = `SELECT produktID, pris FROM produkt WHERE produktID = ?`;
//         let productResult = await db.query(checkProductSql, [produktID]);
        
//         if (productResult.length === 0) {
//             throw new Error('Product ID ' + produktID + ' does not exist.');
//         }

//         let price = productResult[0].pris;
//         console.log('Product Price:', price);

//         // Kontrollera lagerstatus
//         let checkStockSql = `SELECT antal_produkt FROM lager WHERE produktID = ?`;
//         let stockResult = await db.query(checkStockSql, [produktID]);

//         if (stockResult.length === 0) {
//             throw new Error('No stock information found for product ID ' + produktID);
//         }

//         let stock = stockResult[0].antal_produkt;
//         console.log('Product Stock:', stock);

//         if (antal > stock) {
//             throw new Error('Not enough stock for product ID ' + produktID);
//         }

//         // Lägg till produkten i orderrad-tabellen
//         let sql = `INSERT INTO orderrad (orderID, produktID, antal, pris) VALUES (?, ?, ?, ?)`;
//         let res = await db.query(sql, [orderID, produktID, antal, price]);

//         console.log(`Product ID ${produktID} added to order ID ${orderID}`);
//         return res.affectedRows;
//     } catch (error) {
//         console.error('Error adding product to order:', error.message);
//         throw error;
//     }
// }





/**
 * 
 * @param {*} orderID 
 * @returns 
 */
async function completeOrder(orderID) {
    let sql = `UPDATE orders SET status = 'Beställd', ordered_at = CURRENT_TIMESTAMP WHERE orderID = ?`;
    let res;

    res = await db.query(sql, [orderID]);

    console.log(`Order ID ${orderID} marked as ordered`);
    return res.affectedRows;
}

/**
 * 
 * @param {*} orderID 
 * @returns 
 */
async function getOrderDetails(orderID) {
    let sql = `
        SELECT
            o.orderID,
            o.orderdatum,
            o.kundID,
            o.status,
            orad.antal,
            orad.pris,
            p.namn AS produktNamn
        FROM orders o
        LEFT JOIN orderrad orad ON o.orderID = orad.orderID
        LEFT JOIN produkt p ON orad.produktID = p.produktID
        WHERE o.orderID = ?;
    `;

    let result = await db.query(sql, [orderID]);

    if (result.length === 0) {
        return null; // Om ingen order hittas
    }

    // Formatera resultatet till en strukturerad ordning
    let orderDetails = {
        orderID: result[0].orderID,
        orderdatum: result[0].orderdatum,
        kundID: result[0].kundID,
        status: result[0].status,
        orderLines: result.map(line => ({
            antal: line.antal,
            pris: line.pris,
            produktNamn: line.produktNamn
        }))
    };

    return orderDetails;
}

/**
 * Hämta orderstatus för en given orderID.
 *
 * @param {number} orderID - ID för den order vars status vi vill hämta.
 * @returns {Promise<string>} - Returnerar orderstatusen.
 */
async function getOrderStatus(orderID) {
    try {
        const sql = `SELECT status FROM orders WHERE orderID = ?`;
        const result = await db.query(sql, [orderID]);

        if (result.length === 0) {
            throw new Error(`Order with ID ${orderID} not found.`);
        }

        return result[0].status;
    } catch (error) {
        console.error("Error fetching order status:", error.message);
        throw error;
    }
}
