/**
 * Route for eshop.
 */

"use strict";

const express    = require("express");
const router     = express.Router();
const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const eshop       = require("../src/eshop.js");
const sitename   = "| RetroRecords";

module.exports = router;

router.get("/index", (req, res) => {
    let data = {
        title: `Welcome ${sitename}`
    };

    res.render("eshop/index", data);
});

router.get("/about", (req, res) => {
    let data = {
        title: `About ${sitename}`
    };

    res.render("eshop/about", data);
});

router.get("/category", async (req, res) => {
    let data = {
        title: `Category ${sitename}`,
    };

    data.res = await eshop.showCategory();

    res.render("eshop/category", data);
});

router.get("/product", async (req, res) => {
    // let id = req.params.id;
    let data = {
        title: `Product ${sitename}`,
        // Produkt: id
    };

    data.res = await eshop.showAllProducts();

    res.render("eshop/product", data);
});

router.get("/create", (req, res) => {
    let data = {
        title: `Create new product ${sitename}`
    };

    res.render("eshop/create", data);
});

router.post("/create", urlencodedParser, async (req, res) => {
    // console.log(JSON.stringify(req.body, null, 4));
    await eshop.createProduct(
        req.body.id,
        req.body.name,
        req.body.price,
        req.body.description,
        req.body.manufacturer,
        req.body.categoryID
    );
    res.redirect("/eshop/product");
});

router.get("/product/:id", async (req, res) => {
    let id = req.params.id;
    let data = {
        title: `Product ${id} ${sitename}`,
        Produkt: id
    };

    data.res = await eshop.showProduct(id);

    res.render("eshop/product", data);
});

router.get("/edit/:id", async (req, res) => {
    let id = req.params.id;
    let data = {
        title: `Edit product ${id} ${sitename}`,
        Produkt: id
    };

    data.res = await eshop.showProduct(id);

    res.render("eshop/edit", data);
});

router.post("/edit", urlencodedParser, async (req, res) => {
    //console.log(JSON.stringify(req.body, null, 4));
    await eshop.editProduct(req.body.id, req.body.name, req.body.price, req.body.description);
    res.redirect(`/eshop/product`);
});

router.get("/delete/:id", async (req, res) => {
    let id = req.params.id;
    let data = {
        title: `Delete product ${id} ${sitename}`,
        Produkt: id
    };

    data.res = await eshop.showProduct(id);

    res.render("eshop/delete", data);
});

router.post("/delete", urlencodedParser, async (req, res) => {
    //console.log(JSON.stringify(req.body, null, 4));
    await eshop.deleteProduct(req.body.id);
    res.redirect(`/eshop/product`);
});






router.get("/customer", async (req, res) => {
    let data = {
        title: `Customer ${sitename}`,
    };

    data.res = await eshop.showAllCustomers();

    res.render("eshop/customer", data);
});

// Route to create a new order for a specific customer
router.get("/customer/:kundID/create-order", async (req, res) => {
    let kundID = req.params.kundID;
    let products = await eshop.showAllProducts();
    console.log("**********", products);
    let data = {
        title: `Create Order for Customer ${kundID}`,
        kundID: kundID,
        products: products
    };

    res.render("eshop/createorder", data);
});

// router.post("/customer/:kundID/create-order", async (req, res) => {
//     let kundID = req.params.kundID;
//     let orderdatum = new Date();
//     let sql = `INSERT INTO orders (orderdatum, kundID, status) VALUES (?, ?, 'Pending')`;

//     await db.query(sql, [orderdatum, kundID]);

//     res.redirect(`/eshop/order`);
// });

router.post("/customer/:kundID/create-order", urlencodedParser, async (req, res) => {
    let kundID = req.params.kundID;
    let orderdatum = new Date();
    let products = req.body.products;
    let orderID = await eshop.createOrder(kundID);

    // Lägg till produkter till ordern
    for (let produktID in products) {
        let antal = parseInt(products[produktID]);
        if (antal > 0) {
            try {
                await eshop.addProductToOrder(orderID, produktID, antal);
                console.log("Created order ID:", orderID);
            } catch (error) {
                console.error(`Error adding product ${produktID} to order ${orderID}:`, error.message);
            }
        }
    }

    res.redirect(`/eshop/order/details/${orderID}`);
});





router.get("/order", async (req, res) => {
    let data = {
        title: `Orders ${sitename}`,
    };

    data.res = await eshop.showAllOrders();

    res.render("eshop/order", data);
});

router.post("/order/create/:kundID", async (req, res) => {
    let kundID = req.body.kundID; 
    let orderID = await eshop.createOrder(kundID);

    res.redirect(`/eshop/order/${orderID}`);
});

router.post("/order/:id/add-product", async (req, res) => {
    let orderID = req.params.id;
    let produktID = req.body.produktID;
    let antal = req.body.antal;

    await eshop.addProductToOrder(orderID, produktID, antal);
    res.redirect(`/eshop/order/${orderID}`);
});

router.post("/order/:id/complete", async (req, res) => {
    let orderID = req.params.id;
    await eshop.completeOrder(orderID);

    res.redirect(`/eshop/order/${orderID}`);
});

// Visar orderdetaljer
router.get("/order/details/:orderID", async (req, res) => {
    const orderID = req.params.orderID;

    try {
        const orderDetails = await eshop.getOrderDetails(orderID);
        const products = await eshop.showAllProducts();
        res.render("eshop/orderdetails", { order: orderDetails, orderLines: orderDetails.orderLines, products: products });
    } catch (error) {
        console.error(error.message);
        res.status(404).send("Order not found");
    }
});


// Redigera orderstatus
router.get("/order/edit/:orderID", async (req, res) => {
    const orderID = req.params.orderID;

    try {
        // Hämta nuvarande status för ordern
        const orderStatus = await eshop.getOrderStatus(orderID);

        // Rendera editorderstatus-vyn och skicka med orderID och status
        res.render("eshop/editorderstatus", { orderID, status: orderStatus });
    } catch (error) {
        console.error(`Error fetching order status for order ${orderID}:`, error.message);
        res.status(500).send("Error fetching order status.");
    }
});

router.post("/order/edit/:orderID", async (req, res) => {
    console.log(req.body);  // Lägg till denna rad för att debugga
    const orderID = req.params.orderID;
    const newStatus = req.body.status;

    try {
        const sql = `UPDATE orders SET status = ? WHERE orderID = ?`;
        await db.query(sql, [newStatus, orderID]);

        console.log(`Order ID ${orderID} updated to status ${newStatus}`);
        res.redirect(`/eshop/order/details/${orderID}`);
    } catch (error) {
        console.error(`Error updating order status for order ${orderID}:`, error.message);
        res.status(500).send("Error updating order status.");
    }
});





// Lägg till produkter till en befintlig order
router.post("/order/:orderID/add-products", urlencodedParser, async (req, res) => {
    let orderID = req.params.orderID;
    let products = req.body.products;

    // Lägg till produkterna i ordern
    for (let produktID in products) {
        let antal = parseInt(products[produktID]);

        if (antal > 0) {
            try {
                await eshop.addProductToOrder(orderID, produktID, antal);
                console.log(`Added ${antal} of product ID ${produktID} to order ID ${orderID}`);
            } catch (error) {
                console.error(`Error adding product ${produktID} to order ${orderID}:`, error.message);
            }
        }
    }

    res.redirect(`/eshop/order/details/${orderID}`);
});













// Route to add a new product to an order
router.get("/order/:orderID/add-product", async (req, res) => {
    let orderID = req.params.orderID;
    let sql = `SELECT produktID, namn FROM produkt`;
    let products = await db.query(sql);

    let data = {
        title: `Add Product to Order ${orderID}`,
        orderID: orderID,
        products: products
    };

    res.render("eshop/addproducttoorder", data);
});

router.post("/order/:orderID/add-product", async (req, res) => {
    let orderID = req.params.orderID;
    let { produktID, antal } = req.body;
    let sql = `INSERT INTO orderrad (orderID, produktID, antal) VALUES (?, ?, ?)`;

    await db.query(sql, [orderID, produktID, antal]);

    res.redirect(`/eshop/order/${orderID}`);
});
