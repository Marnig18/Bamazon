//requiring dependencies

var mysql = require("mysql");
var inquirer = require("inquirer");
var count = 0
 
 //function for all actions to callback later
var connect = function(){
	//connecting to mysql database
	var connection = mysql.createConnection({
	  host: "localhost",
	  port: 3306,

	  // Your username
	  user: "root",

	  // Your password
	  password: "",
	  database: "bamazon"
	});


//connecting to mysql

connection.connect(function(err) {
  if (err) throw err;
  

 	connection.query("SELECT * FROM products", function(err, res){
 		if(err) throw(res);
 		
 			//looping through products table and displaying information for each item
 			for(var i = 0; i<res.length; i++){
 				console.log("==================")
 				console.log("\nItem Id: " + res[i].item_id  + "\nProduct: " + res[i].product_name + "\nPrice: " +  res[i].price);

 			}
 	
 
//asking if they want to buy anything and how much
	 	inquirer.prompt([
	 			{
	 				type: "input",
	 				message: "Which item would you like to buy? Please enter the item id number",
	 				name: "itemNum",

	 				//validating that input was a number
	 				validate: function(value) {
	          if (isNaN(value) === false) {
	            return true;
	          }
	          return false;
        		}

	 			},

	 			{
	 				type: "",
	 				message: "How many units would you like to buy?",
	 				name: "quantity",
	 				validate: function(value) {
	          if (isNaN(value) === false) {
	            return true;
	          }
	          return false;
	        	}		
	 			}
	 		]).then(function(result){
	 			//getting index(i) of item selected
	 			var i = result.itemNum - 1 

	 			//checking if quantity in stock of item is greater than the quantity wanted to buy
	 				if(result.quantity < res[i].stock_quantity){
	 					var itemPrice = res[i].price;
	 					var numLeft = (res[i].stock_quantity - result.quantity)
			 	
			 		

	 				// if it is-- updating the products table to refelced to quantity in stock	
					connection.query("UPDATE products SET ? WHERE ?",
 							[

								{
									stock_quantity: numLeft
								},

								{
									item_id: result.itemNum
								}

 							], function(err, answer){
						 		console.log(answer.affectedRows)
						 	})

 					
 						//calculating the total price and displaying it to the console	
 						console.log("====================")
 						var price = itemPrice * result.quantity
 						var totalPrice = price.toFixed(2);
 						console.log("Your total is: " + totalPrice);
 						}
	 				//if not enough quantity in stock
 					else{
 						console.log("====================")
						console.log("Insufficinet quantity. Your order did not go through.");
	 				}

	 			//asking if they want to do something els
				inquirer.prompt([
				{
					type: "confirm",
					message: "Would you like to buy something else?",
					name: "confirm",
					default: true
				}
			]).then(function(response){
				//if yes calling the connect function
				if(response.confirm){
					connect();
				}
				//if not --- leaving the program.
				else{
					console.log("bye")
					process.exit(-1);
				}
			})
	 				
	 			});
	 	});
 });
	}

connect(); 		
 		
















