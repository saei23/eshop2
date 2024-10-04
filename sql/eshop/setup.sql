--
-- Skapa databasen eshop om den inte redan finns
--

-- IF NOT EXISTS(SELECT * FROM sys.databases WHERE name = 'eshop')
-- BEGIN
--     CREATE DATABASE eshop;
--     PRINT 'Databasen eshop har skapats.';
-- END
-- ELSE
-- BEGIN
--     PRINT 'Databasen eshop finns redan.';
-- END
-- GO

-- Skapa databasen om den inte redan finns
CREATE DATABASE IF NOT EXISTS eshop;

-- Använd databasen
USE eshop;
