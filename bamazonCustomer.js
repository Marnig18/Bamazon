var mysql = require("mysql");
var inquirer = require("inquirer");
var count = 0

var connect = function(){
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
  

 	connection.query("SELECT * FROM products", function(err, res){
 		if(err) throw(res);
 		
 			for(var i = 0; i<res.length; i++){
 				console.log("==================")
 				console.log("\nItem Id: " + res[i].item_id  + "\nProduct: " + res[i].product_name + "\nPrice: " +  res[i].price);

 			}
 	
 

	 	inquirer.prompt([
	 			{
	 				type: "input",
	 				message: "Which item would you like to buy? Please enter the item id number",
	 				name: "itemNum",
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
	 				name: "quantity"
	 			}
	 		]).then(function(result){
	 			var i = result.itemNum - 1 

	 				if(result.quantity < res[i].stock_quantity){
	 					var itemPrice = res[i].price;
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
 						var price = itemPrice * result.quantity
 						var totalPrice = price.toFixed(2);
 						console.log("Your total is: " + totalPrice);
 						}
	 				
 					else{
 						console.log("====================")
						console.log("Insufficinet quantity. Your order did not go through.");
	 				}

	 		
				inquirer.prompt([
				{
					type: "confirm",
					message: "Would you like to buy something else?",
					name: "confirm",
					default: true
				}
			]).then(function(response){
				if(response.confirm){
					connect();
				}
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
 		
















