CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products(
	item_id INTEGER(10) AUTO_INCREMENT NOT NULL,
	product_name VARCHAR(100) NOT NULL,
	department_name VARCHAR(100) NOT NULL,
	price DECIMAL(10, 2) NOT NULL,
	stock_quantity INTEGER(4) NOT NULL
);



INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES("iPhone 6 case", "Electronics", 6.99, 45),
		("Mug", "Home Goods", 12.87, 74),
		("Ground Coffee", "Grocery", 10.47, 108),
		("Harry Potter and the Goblet of Fire", "Books", 8.99, 13),
		("iPhone Charger", "Electronics", 3.99, 8),
		("Tide PODS", "Grocery", 16.89, 30),
		("Keychain", "Home Goods", 2.39, 4),
		("TOMs Womens Classic","Clothing", 48.00, 10),
		("French Coffee Press", "Home Goods", 25.99, 35),
		("Wall Clock", "Home Goods", 86.99, 5)
