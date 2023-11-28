const { Pool } = require('pg');

const host = process.env.DATABASE_HOST;
const user = process.env.DATABASE_USER;
const password = process.env.DATABASE_PASSWORD;
const database = process.env.DATABASE_NAME;
const port = process.env.DATABASE_PORT;


const pool = new Pool({
    host: host,
    user: user,
    password: password,
    database: database,
    port: port
});

pool.connect((err, res) => {
    if (err) {
        console.log(err);
    } else {
        console.log('connected to the database');
    }
});

module.exports = pool;