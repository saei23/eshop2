--
-- insert
--

-- Lägg till kunder från CSV-filen
LOAD DATA LOCAL INFILE 'sql/eshop/kunder.csv'
INTO TABLE kund
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 LINES;

-- Lägg till produktkategorier från CSV-filen
LOAD DATA LOCAL INFILE 'sql/eshop/kategorier.csv'
INTO TABLE kategori
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 LINES;

-- Lägg till produkter från CSV-filen
LOAD DATA LOCAL INFILE 'sql/eshop/produkter.csv'
INTO TABLE produkt
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 LINES;

-- Lägg till lagerhyllor från CSV-filen
LOAD DATA LOCAL INFILE 'sql/eshop/lager.csv'
INTO TABLE lager
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 LINES;

-- Lägg till ordrar från CSV-filen
LOAD DATA LOCAL INFILE 'sql/eshop/ordrar.csv'
INTO TABLE orders
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 LINES;

-- Lägg till orderrader från CSV-filen
LOAD DATA LOCAL INFILE 'sql/eshop/orderrader.csv'
INTO TABLE orderrad
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 LINES;
