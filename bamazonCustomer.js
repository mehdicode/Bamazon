
var mysql = require('mysql');
var Table = require('cli-table2');
var inquirer = require("inquirer");
var stockQ;
var pCount;
var pId;
var pPice;
var tPrice;
var tSales;

var connection = mysql.createConnection({
    host: 'localhost',
    user: '',
    password: '',
    database: 'bamazon',
    multipleStatements: true
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId)
});




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




var askId = function() {




    inquirer.prompt([



        {
            type: "input",
            name: "id",
            message: " Please enter ID of the product you would like to buy"
        }

    ]).then(function(user) {

        pId = parseInt(user.id);

        connection.query("SELECT * FROM products WHERE item_id=" + pId, function(err, res) {
            if (err) throw err;
            stockQ = parseInt(res[0].stock_quantity);
            pPice = parseInt(res[0].price);
            tSales = parseInt(res[0].total_sales);


            inquirer.prompt([



                {
                    type: "input",
                    name: "unit",
                    message: " how many units of the product you would like to buy"
                }

            ]).then(function(user) {
                pCount = parseInt(user.unit);
                if (pCount > stockQ) {
                    console.log("we don't have that much of this product,please try again");
                    askId();
                } else if (0 < pCount && pCount <= stockQ) {

                    stockQ -= pCount;
                    tPrice = pPice * pCount;
                    tSales += tPrice;
                    deductDb();
                    console.log("---purchase successfull---")

                } else {
                    console.log("please try again!!!");
                    askId();
                };




            });



        });



    });


};

var deductDb = function() {




    connection.query("UPDATE products SET ? WHERE ?", [{

        stock_quantity: stockQ,
        total_sales: tSales
    }, {
        item_id: pId




    }], function(err, res) {


    });

};

var askLeave = function() {

};



setTimeout(askId, 1000);

