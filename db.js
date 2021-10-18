const {mysql} = require("mysql");

// MySQL
// const pool = mysql.createPool({
//     host            : 'localhost',
//     user            : 'root',
//     password        : '',
//     database        : 'test_db'
// })


const pool = mysql.createPool({
    connectionLimit : 10,
    host            : 'localhost',
    user            : 'root',
    password        : '',
    database        : 'test_db',
    port            : 3306
})
// client.on("connect", () => {
//     console.log("Database connected");
// })

// client.on("end", () => {
//     console.log("Connnected End");
// })

module.exports = pool;