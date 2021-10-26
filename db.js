const mysql = require("mysql");


var pool = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'test_db'
});



pool.connect(function(error) {
    if (error) {
        console.log("Error");
    } else {
        console.log("Connected");
    }
}); 


module.exports = pool;