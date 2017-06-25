var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);

 	connection.query("SELECT * FROM products", function(err, res){
 		if(err) throw(res);
 		else{
 			for(var i = 0; i<res.length; i++){
 				console.log("\nItem Id: " + res[i].item_id  + "\nProduct: " + res[i].product_name + "\nPrice: " +  res[i].price);

 			}
 		}
 

	 	inquirer.prompt([
	 			{
	 				type: "input",
	 				message: "Which item would you like to buy? Please enter the item id number",
	 				name: "itemNum"

	 			},

	 			{
	 				type: "",
	 				message: "How many units would you like to buy?",
	 				name: "quantity"
	 			}
	 		]).then(function(result){
	 			var i = result.itemNum - 1 

	 				if(result.quantity < res[i].stock_quantity){
	 					var itemPrice = res[i].price;
	 					console.log(res[i].stock_quantity)
	 					console.log(result.quantity)
	 					var numLeft = (res[i].stock_quantity - result.quantity)
			 	
			 		


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

 					
 						
 						console.log("====================")
 						console.log("Your total is: " + (itemPrice * result.quantity));
 						}
	 				
 					else{
 						console.log("====================")
						console.log("Insufficinet quantity. Your order did not go through.");
	 				}

	 				// inquirer.prompt([
	 				// 		{
	 				// 			type: "confirm",
	 				// 			message: "Would you like to buy another item?",
	 				// 			name: "confirm"
	 				// 		}

	 						
	 					])
	 				
	 			});
	 	});
 });
	 		
 		
















