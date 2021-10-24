const mysql = require("mysql2");


// Create a connection to the database
module.exports =  mysql.createConnection({
  host: "localhost",
  user: "test",
  password: "password",
  database: "regina"
});
