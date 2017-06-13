
var mysql = require('mysql');
var Table = require('cli-table2');
var inquirer = require("inquirer");
var stockQ;
var pId;
var addQ;
var pName;
var pDept;
var pPrice;
var pQuan;
var oCost;

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: '',
    multipleStatements: true
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId)
});

setTimeout(ask, 1000);




function viewS() {

    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;

        var table = new Table({
            head: ['item_id', 'product_name', 'product_sales', 'department_name', 'price', 'stock_quantity'],
            colWidths: [10, 45, 15, 30, 10, 18]
        });

        for (var i = 0; i < res.length; i++) {
            table.push(
                [res[i].item_id, res[i].product_name, res[i].total_sales, res[i].department_name, res[i].price, res[i].stock_quantity]

            );


        };
        console.log(table.toString());
    });
};

function addToInv() {

    inquirer.prompt([



        {
            type: "input",
            name: "id",
            message: " Please enter ID of the product you would like to Add"
        }

    ]).then(function(user) {

        pId = parseInt(user.id);

        connection.query("SELECT stock_quantity FROM products WHERE item_id=" + pId, function(err, res) {
            if (err) throw err;


            stockQ = parseInt(res[0].stock_quantity);

        });

        inquirer.prompt([



            {
                type: "input",
                name: "id",
                message: " Please enter the amount you would like to Add"
            }

        ]).then(function(user) {

            addQ = parseInt(user.id) + stockQ;


            connection.query("update products set ? where ?", [{
                stock_quantity: addQ
            }, {
                item_id: pId
            }], function(err, res) {});

            console.log("items successfully added");




        });
    });
};



function ask() {

    inquirer.prompt([



        {
            type: "list",
            name: "doingWhat",
            message: "List of actions",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
        }

    ]).then(function(user) {

        if (user.doingWhat === "View Products for Sale") {

            viewS();

            // askLeave();


        } else if (user.doingWhat === "View Low Inventory") {

            connection.query("SELECT * FROM products", function(err, res) {

                if (err) throw err;

                var table = new Table({
                    head: ['item_id', 'product_name', 'product_sales', 'department_name', 'price', 'stock_quantity'],
                    colWidths: [10, 45, 15, 30, 10, 18]
                });

                for (var i = 0; i < res.length; i++) {

                    stockQ = parseInt(res[i].stock_quantity);

                    if (stockQ < 1000) {

                        table.push(
                            [res[i].item_id, res[i].product_name, res[i].total_sales, res[i].department_name, res[i].price, res[i].stock_quantity]
                        );
                    }




                };

                console.log(table.toString());




            });

        } else if (user.doingWhat === "Add to Inventory") {


            viewS();
            setTimeout(addToInv, 1000);


        } else if (user.doingWhat === "Add New Product") {

            inquirer.prompt([



                {
                    type: "input",
                    name: "name",
                    message: "What is the name of the product?"
                }

            ]).then(function(user) {

                pName = user.name;

                inquirer.prompt([



                    {
                        type: "input",
                        name: "name",
                        message: "What department does this product fit into?"
                    }

                ]).then(function(user) {

                    pDept = user.name;

                    inquirer.prompt([



                        {
                            type: "input",
                            name: "name",
                            message: "What is the price of the item?"
                        }

                    ]).then(function(user) {

                        pPrice = parseInt(user.name);

                        inquirer.prompt([



                            {
                                type: "input",
                                name: "name",
                                message: "How many of the item are available for sale?"
                            }

                        ]).then(function(user) {

                            pQuan = parseInt(user.name);
                            oCost = Math.floor((Math.random() * 1000) + 1)

                            connection.query("INSERT INTO products SET ?", {
                                product_name: pName,
                                department_name: pDept,
                                price: pPrice,
                                total_sales: 0,
                                stock_quantity: pQuan
                            }, function(err, res) {
                                
                            });

                            connection.query("INSERT INTO departments SET ?", {

                                departmnet_name: pDept,
                                total_sales: 0,
                                over_head_costs: oCost

                            }, function(err, res) {
                                console.log(pQuan + " items Added")
                                viewS();
                            });

                        });

                    });

                });

            });




        }
    });
};

