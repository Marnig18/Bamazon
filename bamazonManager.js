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
	 

  inquirer.prompt([
  		{
  			type: "list",
  			message: "Please choose and option.",
  			name: "action",
  			choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
  		}
  	]).then(function(result){

  			switch(result.action){
  				case("View Products for Sale"):
  					viewProducts();
  					break;
  					
  				case("View Low Inventory"):
  					lowInventory();
  					break;
  				
  				case("Add to Inventory"):
  					addInventory();
  					break;
  				case("Add New Product"):
  					addProduct();
  					break;
  			
  				}
  		
  		
			
  		});
  	});
	








function viewProducts(){

	connection.query("SELECT * FROM products", function(err, res){
		if (err) throw err;

		for(var i = 0; i<res.length; i++){
			console.log("=========================")
			console.log("\nItem Id: " + res[i].item_id  + "\nProduct: " + res[i].product_name + "\nPrice: " +  res[i].price + "\nQuantity: " + res[i].stock_quantity);
		}

		inquirer.prompt([
				{
					type: "confirm",
					message: "Would you like to do something else?",
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
	count++	
  

}


function lowInventory(){

		connection.query("SELECT * FROM products", function(err, res){
		if (err) throw err;

			for(var i = 0; i<res.length; i++){
					if(res[i].stock_quantity < 5){
						console.log("====================")
						console.log("\nItem Id: " + res[i].item_id  + "\nProduct: " + res[i].product_name + "\nPrice: " +  res[i].price + "\nQuantity: " + res[i].stock_quantity);
					
					}
			}
				inquirer.prompt([
				{
					type: "confirm",
					message: "Would you like to do something else?",
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

	count++


}


function addInventory(){

	inquirer.prompt([
			{
				type: "Input",
				message: "Enter Item Id Number",
				name: "ItemNum",
				validate: function(value) {
         if (isNaN(value) === false) {
           return true;
          }
          return false;
        }
			},
			{
				type: "Input",
				message: "Enter how mush you would like to add",
				name: "addedNum",
			  validate: function(value) {
		      if (isNaN(value) === false) {
		        return true;
		      }
		      return false;
        }
			},
		]).then(function(res){
			var i = res.ItemNum -1  
			connection.query("SELECT * FROM products", function(err, response){
				var newQuantity = parseInt(response[i].stock_quantity) + parseInt(res.addedNum) 	

				inquirer.prompt([
						{
							type: "confirm",
							message: "You want to add " + res.addedNum + " " + response[i].product_name + "\nIs this correct?",
							name: "confirm",
							default: true 
						}
					]).then(function(ans){
						if(ans.confirm){
							connection.query("UPDATE products SET ? WHERE ?",
									[
										{
											stock_quantity: newQuantity
										},
										{
											item_id: res.ItemNum
										}

									], function(err, result){	 
											console.log("====================")
											console.log("" + res.addedNum + " new " + response[i].product_name + " Added! The total quantity is " + newQuantity + ".");
												
								})
							}	
							
							else{
								console.log("Nothing Added")
									
							}
								inquirer.prompt([
								{
									type: "confirm",
									message: "Would you like to do something else?",
									name: "confirm",
									default: true
								}
							]).then(function(answer){
								if(answer.confirm){
									connect();
								}
								else{
									console.log("bye")
									process.exit(-1);
								}
							})
						})
					
				});
			
		});
		count++	
  

	}



function addProduct(){

		 inquirer.prompt([
		 		{
		 			type: "Input",
		 			message: "Enter Item Name",
		 			name: "name"

		 		},
		 		{
		 			type: "Input",
		 			message: "Enter department name.",
		 			name: "department"
		 		},
		 		{
		 			type: "Input",
		 			message: "Enter item price",
		 			name: "price",
		 			validate: function(value) {
          	if (isNaN(value) === false) {
            	return true;
          	}
          return false;
        	}
		 		}, 
		 		{
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

		 	]).then(function(answers){
		 		console.log("=========================")
		 		console.log("You entered: \nItem name: " + answers.name +  " \nDepartment Name: " + answers.department + 
		 			"\nItem Price: " + answers.price + " \nItem Quantity " + answers.quantity);
		 		inquirer.prompt([
		 				{
		 					type: "confirm",
		 					message: "Is this correct?",
		 					name: "confirm",
		 					default: true
		 				}
		 			]).then(function(res){
		 				if(res.confirm){

				 			connection.query("INSERT INTO products SET ?",
				 			{
				 				product_name: answers.name,
				 				department_name: answers.department,
				 				price: answers.price,
				 				stock_quantity: answers.quantity
				 			}), function(err, result){
				 					console.log("" + result.affectedRows + " product inserted!")
				 					
				 			}
				 			
				 		}
				 		else{
				 			console.log("Nothing Added")
				 			
				 		};
				 			inquirer.prompt([
							{
								type: "confirm",
								message: "Would you like to do something else?",
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
		 count++
  	
	};
}

connect();








	

	














