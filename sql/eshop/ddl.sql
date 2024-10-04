--
-- DDL
--

-- Tables

CREATE TABLE `kategori` (
    `kategoriID` INT UNSIGNED AUTO_INCREMENT,
    `namn` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`kategoriID`)
);

CREATE TABLE `produkt` (
    `produktID` INT UNSIGNED AUTO_INCREMENT,
    `namn` VARCHAR(100) NOT NULL,
    `pris` DECIMAL(10, 2) NOT NULL,
    `beskrivning` TEXT,
    `tillverkare` VARCHAR(100),
    `kategoriID` INT UNSIGNED,

    PRIMARY KEY (`produktID`),
    FOREIGN KEY (`kategoriID`) REFERENCES `kategori` (`kategoriID`)
);

CREATE TABLE `lager` (
    `lagerID` INT UNSIGNED AUTO_INCREMENT,
    `kapacitet` INT NOT NULL DEFAULT 50,
    `antal_produkt` INT,
    `plats` VARCHAR(100),
    `produktID` INT UNSIGNED,

    PRIMARY KEY (`lagerID`),
    FOREIGN KEY (`produktID`) REFERENCES `produkt` (`produktID`)
);

CREATE TABLE `kund` (
    `kundID` INT UNSIGNED AUTO_INCREMENT,
    `namn` VARCHAR(100) NOT NULL,
    `adress` VARCHAR(200),
    `kontaktuppgifter` VARCHAR(100),

    PRIMARY KEY (`kundID`)
);

-- CREATE TABLE `orders` (
--     `orderID` INT UNSIGNED AUTO_INCREMENT,
--     `orderdatum` DATE NOT NULL,
--     `leveransdatum` DATE,
--     `status` VARCHAR(50),
--     `kundID` INT UNSIGNED,

--     PRIMARY KEY (`orderID`),
--     FOREIGN KEY (`kundID`) REFERENCES `kund` (`kundID`)
-- );

CREATE TABLE `orders` (
    `orderID` INT UNSIGNED AUTO_INCREMENT,
    `orderdatum` DATE NOT NULL,
    `leveransdatum` DATE,
    `status` VARCHAR(50),
    `kundID` INT UNSIGNED,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted_at` TIMESTAMP NULL,
    `ordered_at` TIMESTAMP NULL,
    `shipped_at` TIMESTAMP NULL,
    PRIMARY KEY (`orderID`),
    FOREIGN KEY (`kundID`) REFERENCES `kund` (`kundID`)
);

CREATE TABLE `orderrad` (
    `orderradID` INT UNSIGNED AUTO_INCREMENT,
    `antal` INT NOT NULL,
    `pris` DECIMAL(10, 2) NOT NULL,
    `orderID` INT UNSIGNED,
    `produktID` INT UNSIGNED,

    PRIMARY KEY (`orderradID`),
    FOREIGN KEY (`orderID`) REFERENCES `orders` (`orderID`),
    FOREIGN KEY (`produktID`) REFERENCES `produkt` (`produktID`)
);

CREATE TABLE `faktura` (
    `fakturaID` INT UNSIGNED AUTO_INCREMENT,
    `fakturadatum` DATE NOT NULL,
    `belopp` DECIMAL(10, 2) NOT NULL,
    `status` VARCHAR(50),
    `kundID` INT UNSIGNED,
    `orderID` INT UNSIGNED,

    PRIMARY KEY (`fakturaID`),
    FOREIGN KEY (`kundID`) REFERENCES `kund` (`kundID`),
    FOREIGN KEY (`orderID`) REFERENCES `orders` (`orderID`)
);

CREATE TABLE `status` (
    `statusID` INT UNSIGNED AUTO_INCREMENT,
    `namn` VARCHAR(50),
    `orderID` INT UNSIGNED,
    `fakturaID` INT UNSIGNED,

    PRIMARY KEY (`statusID`),
    FOREIGN KEY (`orderID`) REFERENCES `orders` (`orderID`),
    FOREIGN KEY (`fakturaID`) REFERENCES `faktura` (`fakturaID`)
);

CREATE TABLE `fakturarad` (
    `fakturaradID` INT UNSIGNED AUTO_INCREMENT,
    `antal` INT NOT NULL,
    `pris_per_enhet` DECIMAL(10, 2) NOT NULL,
    `fakturaID` INT UNSIGNED,

    PRIMARY KEY (`fakturaradID`),
    FOREIGN KEY (`fakturaID`) REFERENCES `faktura` (`fakturaID`)
);

-- skapa loggtabell
CREATE TABLE product_log (
    logID INT UNSIGNED AUTO_INCREMENT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    event_description TEXT,
    PRIMARY KEY (logID)
);


--
-- Triggers
--

-- trigger för INSERT på tabellen Produkt
DELIMITER //
CREATE TRIGGER log_insert_product
AFTER INSERT ON produkt
FOR EACH ROW
BEGIN
    INSERT INTO product_log (event_description)
    VALUES (CONCAT('Ny produkt lades till med produktid ''', NEW.produktID, '''.'));
END;
//
DELIMITER ;


-- trigger för UPDATE på tabellen Produkt
DELIMITER //
CREATE TRIGGER log_update_product
AFTER UPDATE ON produkt
FOR EACH ROW
BEGIN
    INSERT INTO product_log (event_description)
    VALUES (CONCAT('Detaljer om produktid ''', NEW.produktID, ''' uppdaterades.'));
END;
//
DELIMITER ;



--
-- Procedures
--

-- show categories
DROP PROCEDURE IF EXISTS show_category;
DELIMITER ;;
CREATE PROCEDURE show_category()
BEGIN
    SELECT * FROM kategori;
END
;;
DELIMITER ;


-- create
DROP PROCEDURE IF EXISTS create_product;
DELIMITER ;;
CREATE PROCEDURE create_product(
    IN p_produktID INT,
    IN p_namn VARCHAR(100),
    IN p_pris DECIMAL(10, 2),
    IN p_beskrivning TEXT,
    IN p_tillverkare VARCHAR(100),
    IN p_kategoriID INT UNSIGNED
)
BEGIN
    INSERT INTO produkt (produktID, namn, pris, beskrivning, tillverkare, kategoriID) 
    VALUES (p_produktID, p_namn, p_pris, p_beskrivning, p_tillverkare, p_kategoriID);
END
;;
DELIMITER ;


-- show product by id
DROP PROCEDURE IF EXISTS show_product;
DELIMITER ;;
CREATE PROCEDURE show_product(
    IN p_produktID INT UNSIGNED
)
BEGIN
    SELECT p.*, IFNULL(l.antal_produkt, 0) AS antal_i_lagret
    FROM produkt p
    LEFT JOIN lager l ON p.produktID = l.produktID
    WHERE p.produktID = p_produktID;
END
;;
DELIMITER ;

-- show all products
DROP PROCEDURE IF EXISTS show_all_products;
DELIMITER ;;
CREATE PROCEDURE show_all_products()
BEGIN
    SELECT p.*, IFNULL(l.antal_produkt, 0) AS antal_i_lagret
    FROM produkt p
    LEFT JOIN lager l ON p.produktID = l.produktID;
END
;;
DELIMITER ;




-- edit
DROP PROCEDURE IF EXISTS edit_product;
DELIMITER ;;
CREATE PROCEDURE edit_product(
    IN p_produktID INT UNSIGNED,
    IN p_namn VARCHAR(100),
    IN p_pris DECIMAL(10, 2),
    IN p_beskrivning TEXT
)
BEGIN
    UPDATE produkt SET
        `namn` = p_namn,
        `pris` = p_pris,
        `beskrivning` = p_beskrivning
    WHERE
        `produktID` = p_produktID;
END
;;
DELIMITER ;


-- delete
DROP PROCEDURE IF EXISTS delete_product;
DELIMITER ;;
CREATE PROCEDURE delete_product(
    IN p_produktID INT UNSIGNED
)
BEGIN
    DELETE FROM produkt
    WHERE
        `produktID` = p_produktID;
END
;;
DELIMITER ;


-- show all customers
DROP PROCEDURE IF EXISTS show_all_customers;
DELIMITER ;;
CREATE PROCEDURE show_all_customers()
BEGIN
    SELECT * FROM kund;
END
;;
DELIMITER ;


-- show all orders
DROP PROCEDURE IF EXISTS show_all_orders;
DELIMITER ;;
CREATE PROCEDURE show_all_orders()
BEGIN
    SELECT
        o.orderID,
        o.orderdatum,
        o.kundID,
        COUNT(orad.orderradID) AS totalt_antal_orderrader,
        o.status
    FROM
        orders o
    LEFT JOIN
        orderrad orad ON o.orderID = orad.orderID
    WHERE
        o.deleted_at IS NULL -- visa bara ordrar som inte raderats
    GROUP BY
        o.orderID, o.orderdatum, o.kundID, o.status
    ORDER BY
        o.orderdatum DESC;
END
;;
DELIMITER ;


--
-- procedurer för terminalklienten
--

-- about
DROP PROCEDURE IF EXISTS about;
DELIMITER ;;
CREATE PROCEDURE about()
BEGIN
    SELECT 'Gruppmedlemmar: Saga Eriksson';
END
;;
DELIMITER ;

-- log
DROP PROCEDURE IF EXISTS show_log;
DELIMITER ;;
CREATE PROCEDURE show_log(
    IN p_number INT
)
BEGIN
    SELECT *
    FROM product_log
    ORDER BY `timestamp` DESC
    LIMIT p_number;
END
;;
DELIMITER ;

-- shelf
DROP PROCEDURE IF EXISTS show_shelves;
DELIMITER ;;
CREATE PROCEDURE show_shelves()
BEGIN
    SELECT DISTINCT plats AS shelf FROM lager;
END
;;
DELIMITER ;

-- inventory (inv)
DROP PROCEDURE IF EXISTS show_inventory;
DELIMITER ;;
CREATE PROCEDURE show_inventory()
BEGIN
    SELECT p.produktID, p.namn AS produkt_namn, l.plats AS lagerhylla, l.antal_produkt AS antal
    FROM produkt p
    INNER JOIN lager l ON p.produktID = l.produktID;
END
;;
DELIMITER ;

-- inventory with filter (Inv <str>)
DROP PROCEDURE IF EXISTS filter_inventory;
DELIMITER ;;
CREATE PROCEDURE filter_inventory(
    IN p_str VARCHAR(255)
)
BEGIN
    SELECT p.produktID, p.namn AS produkt_namn, l.plats AS lagerhylla, l.antal_produkt AS antal
    FROM produkt p
    INNER JOIN lager l ON p.produktID = l.produktID
    WHERE p.produktID = p_str OR p.namn LIKE CONCAT('%', p_str, '%') OR l.plats LIKE CONCAT('%', p_str, '%');
END
;;
DELIMITER ;

-- inventory add (InvAdd)
DROP PROCEDURE IF EXISTS add_to_inventory;
DELIMITER ;;
CREATE PROCEDURE add_to_inventory(
    IN p_productID INT,
    IN p_shelf VARCHAR(100),
    IN p_quantity INT
)
BEGIN
    INSERT INTO lager (produktID, plats, antal_produkt)
    VALUES (p_productID, p_shelf, p_quantity)
    ON DUPLICATE KEY UPDATE antal_produkt = antal_produkt + p_quantity;
END
;;
DELIMITER ;

-- inventory delete (InvDel)
DROP PROCEDURE IF EXISTS delete_from_inventory;
DELIMITER ;;
CREATE PROCEDURE delete_from_inventory(
    IN p_productID INT,
    IN p_shelf VARCHAR(100),
    IN p_quantity INT
)
BEGIN
    UPDATE lager
    SET antal_produkt = GREATEST(antal_produkt - p_quantity, 0)
    WHERE produktID = p_productID AND plats = p_shelf;
END
;;
DELIMITER ;


--
-- Egendefinierad funktion för orderstatus
--

DROP FUNCTION IF EXISTS order_status;
DELIMITER ;;
CREATE FUNCTION order_status(
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP,
    ordered_at TIMESTAMP,
    shipped_at TIMESTAMP
) RETURNS VARCHAR(20)
DETERMINISTIC
BEGIN
    DECLARE status VARCHAR(20);

    IF shipped_at IS NOT NULL THEN
        SET status = "Skickad";
    ELSEIF ordered_at IS NOT NULL THEN
        SET status = "Beställd";
    ELSEIF deleted_at IS NOT NULL THEN
        SET status = "Raderad";
    ELSEIF updated_at IS NOT NULL THEN
        SET status = "Uppdaterad";
    ELSE
        SET status = "Skapad";
    END IF;

    RETURN status;
END;;
DELIMITER ;


--
-- Index för tabellen orders
--
-- Drop Indexes
DROP INDEX IF EXISTS idx_kundID ON orders;
DROP INDEX IF EXISTS idx_order_status ON orders;

CREATE INDEX idx_kundID ON orders (kundID);
CREATE INDEX idx_order_status ON orders (status);
