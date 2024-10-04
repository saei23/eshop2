/**
 * Present reports from the database.
 */
"use strict";

const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const Database = require("./src/database");
const Ecommands = require("./src/ecommands");
const config = require("./config/db/eshop.json");

let result;

/**
 * Main function to run the terminal program.
 * @returns {void}
 */
(async function() {
    // const database = new database(config);
    const db = new Database(config);

    rl.setPrompt("Command: ");
    rl.prompt();

    rl.on("close", () => {
        console.log("Exiting program...");
        process.exit(0);
    });

    rl.on("line", async (line) => {
        line = line.trim();
        let parts = line.split(" ");

        switch (parts[0]) {
            case "exit":
            case "quit":
                rl.close();
                break;
            case "menu":
            case "help":
                showMenu();
                break;
            case "about":
                result = await Ecommands.about(db);
                console.table(result);
                break;
            case "log":
                result = await Ecommands.log(db, parts[1]);
                console.table(result);
                break;
            case "product":
                result = await Ecommands.showProducts(db);
                console.table(result);
                break;
            case "shelf":
                result = await Ecommands.showShelf(db);
                console.table(result);
                break;
            case "inv":
                if (parts.length === 1) {
                    result = await Ecommands.inv(db);
                    console.table(result);
                } else if (parts.length === 2) {
                    result = await Ecommands.filterInv(db, parts[1]);
                    console.table(result);
                } else {
                    console.log("Invalid usage. Usage: inv OR inv <str>");
                }
                break;
            case "invadd":
                result = await Ecommands.addProducts(db, parts[1], parts[2], parts[3]);
                console.table(result);
                break;
            case "invdel":
                result = await Ecommands.deleteProducts(db, parts[1], parts[2], parts[3]);
                console.table(result);
                break;
            default:
                console.log("Invalid command. Type 'menu' or 'help' for available commands.");
        }
        rl.prompt();
    });
})();

/**
 * Show menu with available commands.
 * @returns {void}
 */
function showMenu() {
    console.log(
        `Available commands:\n`
        + `  exit, quit - Exit the program.\n`
        + `  menu, help - Show this menu.\n`
        + `  about - Visa namn på de som gjort uppgiften.\n`
        + `  log <number> - Visa de senaste raderna i loggtabellen.\n`
        + `  product - Visa alla produkter.\n`
        + `  shelf - Visa vilka lagerhyllor som finns.\n`
        + `  inv - Tabell över produkter och dess plats i lagret.\n`
        + `  inv <str> - Filtrering av produktid, produktnamn eller lagerhylla.\n`
        + `  invadd <productid> <shelf> <number> - Lägg till ett visst antal av en produkt.\n`
        + `  invdel <productid> <shelf> <number> - Ta bort ett visst antal produkter.`
    );
}
