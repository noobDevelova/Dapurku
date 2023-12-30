import mysql2 from 'mysql2'

const sql = mysql2;
const db = sql.createConnection({
    host: "localhost",
    database: "db_dapurku",
    user: "root",
    password: "",
    port: 3306
})

export default db;