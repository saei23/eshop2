-- SQL-fil som kan återskapa hela databasen från början till slut

-- Drop existing triggers
DROP TRIGGER IF EXISTS `log_product_insert`;
DROP TRIGGER IF EXISTS `log_product_update`;

-- Drop existing procedures
DROP PROCEDURE IF EXISTS `show_category`;
DROP PROCEDURE IF EXISTS `create_product`;
DROP PROCEDURE IF EXISTS `show_product`;
DROP PROCEDURE IF EXISTS `edit_product`;
DROP PROCEDURE IF EXISTS `delete_product`;
DROP PROCEDURE IF EXISTS `show_all_products`;
DROP PROCEDURE IF EXISTS `about`;
DROP PROCEDURE IF EXISTS `show_log`;
DROP PROCEDURE IF EXISTS `show_shelves`;
DROP PROCEDURE IF EXISTS `show_inventory`;
DROP PROCEDURE IF EXISTS `filter_inventory`;
DROP PROCEDURE IF EXISTS `add_to_inventory`;
DROP PROCEDURE IF EXISTS `delete_from_inventory`;

-- Drop functions
DROP FUNCTION IF EXISTS order_status;

-- Drop Indexes
DROP INDEX IF EXISTS idx_kundID ON orders;
DROP INDEX IF EXISTS idx_order_status ON orders;

-- Drop existing tables
DROP TABLE IF EXISTS `kategori`;
DROP TABLE IF EXISTS `produkt`;
DROP TABLE IF EXISTS `lager`;
DROP TABLE IF EXISTS `kund`;
DROP TABLE IF EXISTS `orders`;
DROP TABLE IF EXISTS `orderrad`;
DROP TABLE IF EXISTS `faktura`;
DROP TABLE IF EXISTS `status`;
DROP TABLE IF EXISTS `fakturarad`;
DROP TABLE IF EXISTS `product_Log`;



source setup.sql;
source ddl.sql;
source insert.sql;
