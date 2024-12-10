const mysql = require('mysql');

const admin_connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'super_admin_nuxt'
});

module.exports = admin_connection;