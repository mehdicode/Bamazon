
var inquirer = require("inquirer");
var mysql = require('mysql');
var Table = require('cli-table2');

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

setTimeout(ask, 1000);


function ask() {

    inquirer.prompt([


        {
            type: "list",
            name: "doingWhat",
            message: "What would you like to do?",
            choices: ["View product sales by Department", "Create new Department"]
        }

    ]).then(function(user) {

        if (user.doingWhat === "View product sales by Department") {

            connection.query("SELECT *,(total_sales-over_head_costs) as total_profit from departments", function(err, res) {
                if (err) throw err;

                var table = new Table({
                    head: ['department_id', 'department_name', 'over_head_costs', 'total_sales', 'total_profit'],
                    colWidths: [20, 20, 20, 20, 20]
                });

                for (var i = 0; i < res.length; i++) {
                    table.push(
                        [res[i].department_id, res[i].departmnet_name, res[i].over_head_costs, res[i].total_sales, res[i].total_profit]

                    );


                };
                console.log(table.toString());
            });

            // connection.query("SELECT over_head_costs,total_sales,(total_sales-over_head_costs) as total_profit from departments", function(err, res){
            //     if (err) throw err;
            //     console.log(res);
            // })




        } else if (user.doingWhat === "Create new Department") {

            inquirer.prompt([{
                type: 'input',
                message: 'Name: ',
                name: 'Name'
            }, {
                type: 'input',
                message: 'Overhead Costs: ',
                name: 'Overhead'
            }]).then(function(data) {
                connection.query('INSERT INTO departments SET?', {
                    departmnet_name: data.Name,
                    over_head_costs: data.Overhead,
                    total_sales: 0
                }, function(err, res) {
                    if (err) throw err;
                    console.log('Department added!');
                    connection.query('SELECT * FROM departments', function(error, response) {
                        if (error) throw error;

                        var table = new Table({
                            head: ['department_id', 'department_name', 'over_head_costs', 'total_sales', 'total_profit'],
                            colWidths: [20, 20, 20, 20, 20]
                        });

                        for (var i = 0; i < response.length; i++) {
                            table.push(
                                [response[i].department_id, response[i].departmnet_name, response[i].over_head_costs, response[i].total_sales, (response[i].total_sales - response[i].over_head_costs)]
                            );
                        }
                        console.log(table.toString());

                    });
                })
            })




        }

    });

};

