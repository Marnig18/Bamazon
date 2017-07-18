var mysql = require("mysql");
var inquirer = require("inquirer");

//All code is in a function for later recursion
var connect = function() {
	///Creating mysql connection 
	var connection = mysql.createConnection({
		host: "localhost",
		port: 3306,

		// Your username
		user: "root",

		// Your password
		password: "",
		database: "bamazon"
	});

	///Connecting to mysql
	connection.connect(function(err) {
		if (err) throw err;

		/// Prompting for manager options and calling functions associated with them
		inquirer.prompt([{
			type: "list",
			message: "Please choose and option.",
			name: "action",
			choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
		}]).then(function(result) {

			switch (result.action) {
				case ("View Products for Sale"):
					viewProducts();
					break;

				case ("View Low Inventory"):
					lowInventory();
					break;

				case ("Add to Inventory"):
					addInventory();
					break;
				case ("Add New Product"):
					addProduct();
					break;

			}

		});
	});



	//Function for viewing products for sale
	function viewProducts() {

		connection.query("SELECT * FROM products", function(err, res) {
			if (err) throw err;
			//looping though the products table to display each item informatiom
			for (var i = 0; i < res.length; i++) {
				console.log("=========================")
				console.log("\nItem Id: " + res[i].item_id + "\nProduct: " + res[i].product_name + "\nPrice: " + res[i].price + "\nQuantity: " + res[i].stock_quantity);
			}
			/// Asking if they want to do somthing else
			inquirer.prompt([{
				type: "confirm",
				message: "Would you like to do something else?",
				name: "confirm",
				default: true
			}]).then(function(response) {
				// if Yes - recalling the connect function
				console.log("=================")
				if (response.confirm) {
					connect();
				}
				// if no - exiting the program
				else {
					console.log("bye")
					process.exit(-1);
				}
			})

		});

	}

	///Function to view low inventory
	function lowInventory() {

		connection.query("SELECT * FROM products", function(err, res) {
			if (err) throw err;
			//looping through products table to find items with quantitiy less than 5 
			//and displayings its infomation
			for (var i = 0; i < res.length; i++) {
				if (res[i].stock_quantity < 5) {
					console.log("====================")
					console.log("\nItem Id: " + res[i].item_id + "\nProduct: " + res[i].product_name + "\nPrice: " + res[i].price + "\nQuantity: " + res[i].stock_quantity);

				}
			}
			// Asking if they want to do somthing else
			inquirer.prompt([{
				type: "confirm",
				message: "Would you like to do something else?",
				name: "confirm",
				default: true
			}]).then(function(response) {
				// if Yes - recalling the connect function
				console.log("====================")
				if (response.confirm) {
					connect();
				}
				// if no - exiting the program
				else {
					console.log("bye")
					process.exit(-1);
				}
			})

		});
	}

	/// Function to add inventory
	function addInventory() {

		///asking for item id of the item they want to add stock to
		inquirer.prompt([{
			type: "Input",
			message: "Enter Item Id Number",
			name: "ItemNum",
			///checking that input is a number
			validate: function(value) {
				if (isNaN(value) === false) {
					return true;
				}
				return false;
			}
		}, {
			//asking the amount they wish to added
			type: "Input",
			message: "Enter how much you would like to add",
			name: "addedNum",
			//cheking that input is number
			validate: function(value) {
				if (isNaN(value) === false) {
					return true;
				}
				return false;
			}
		}, ]).then(function(res) {
			//getting the index of the item they wanted added to in the products array
			var i = res.ItemNum - 1
				//adding the original stock qunatity of the item at i to the new quantity provided to create new quantity
			connection.query("SELECT * FROM products", function(err, response) {
				var newQuantity = parseInt(response[i].stock_quantity) + parseInt(res.addedNum)

				//if number added is greater than one add an s to the end of the product name
				if (res.addedNum > 1) {
					var productName = response[i].product_name + "s."
				}
				//console.loging the provided information
				console.log("You want to add " + res.addedNum + " " + productName)

				//confirming that this information is correct
				inquirer.prompt([{
					type: "confirm",
					message: "Is this correct?",
					name: "confirm",
					default: true
				}]).then(function(ans) {
					// if correct, updating the database 
					if (ans.confirm) {
						connection.query("UPDATE products SET ? WHERE ?", [{
								stock_quantity: newQuantity
							}, {
								item_id: res.ItemNum
							}

						], function(err, result) {
							console.log("====================")
							console.log("" + res.addedNum + " new " + productName + " Added! The total quantity is " + newQuantity + ".");

						})
					}
					//if wrong, doing nothing
					else {
						console.log("Nothing Added")

					}
					inquirer.prompt([{
						type: "confirm",
						message: "Would you like to do something else?",
						name: "confirm",
						default: true
					}]).then(function(answer) {
						console.log("====================")
						if (answer.confirm) {
							connect();
						} else {
							console.log("bye")
							process.exit(-1);
						}
					})
				})

			});

		});



	}

	////function to add a New Product

	function addProduct() {

		/// getting information about new item
		inquirer.prompt([{
				type: "Input",
				message: "Enter Item Name",
				name: "name"

			}, {
				type: "Input",
				message: "Enter department name.",
				name: "department"
			}, {
				type: "Input",
				message: "Enter item price",
				name: "price",
				validate: function(value) {
					if (isNaN(value) === false) {
						return true;
					}
					return false;
				}
			}, {
				type: "Input",
				message: "Enter stock quantity",
				name: "quantity",
				validate: function(value) {
					if (isNaN(value) === false) {
						return true;
					}
					return false;
				},

			}

		]).then(function(answers) {
			console.log("=========================")
				///logging the answers
			console.log("You entered: \nItem name: " + answers.name + " \nDepartment Name: " + answers.department +
				"\nItem Price: " + answers.price + " \nItem Quantity " + answers.quantity);
			//confirming the information is correct
			inquirer.prompt([{
				type: "confirm",
				message: "Is this correct?",
				name: "confirm",
				default: true
			}]).then(function(res) {
				//if confirmed - inserting the new item into the products table
				if (res.confirm) {

					connection.query("INSERT INTO products SET ?", {
							product_name: answers.name,
							department_name: answers.department,
							price: answers.price,
							stock_quantity: answers.quantity
						}),
						function(err, result) {
							console.log(result.affectedRows + " product inserted!")

						}

				} else {
					console.log("Nothing Added")

				};

				////asking if they want to do someting else
				inquirer.prompt([{
					type: "confirm",
					message: "Would you like to do something else?",
					name: "confirm",
					default: true
				}]).then(function(response) {
					console.log("====================")
					if (response.confirm) {
						connect();
					} else {
						console.log("bye")
						process.exit(-1);
					}
				})
			});
		});


	};
}


////Calling the Connect Function
connect();