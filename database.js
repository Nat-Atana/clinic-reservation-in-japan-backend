const mysql2 = require('mysql2');
const { exec } = require('child_process');
const connectionPools = {};

const getDbNameFromHost = (host) => {
    const parts = host.split('.');
    if (parts.length >= 3) {
        return `db_${parts[0]}`;
    }
    return 'db_clinic';
};

const createDbConnection = (config) => {
    return mysql2.createPool(config);
};

const getDbConnection = (host) => {
    if (connectionPools[host]) {
        return connectionPools[host];
    }

    const dbName = getDbNameFromHost(host);
    const config = {
        host: 'localhost',
        user: 'root',
        password: '',
        database: dbName,
        waitForConnections: true,
        connectionLimit: 10, // Adjust based on your server capacity and expected traffic
        queueLimit: 0
    };

    const dbConnection = createDbConnection(config);
    connectionPools[host] = dbConnection;

    // Monitor connection pool events
    dbConnection.on('acquire', (connection) => {
        console.log('Connection acquired:', connection.threadId);
    });

    dbConnection.on('release', (connection) => {
        console.log('Connection released:', connection.threadId);
    });

    // Test the connection and handle errors
    dbConnection.getConnection((err, connection) => {
        if (err) {
            console.error('Database connection error:', err);
            if (err.code === 'ER_BAD_DB_ERROR') {
                console.error(`Database '${dbName}' does not exist.`);
            } else if (err.code === 'ER_CON_COUNT_ERROR') {
                console.error('Too many connections to the database.');
            }
            restartApp();
        } else {
            connection.release();
        }

        connection.on('error', (err) => {
            console.error('Fatal error in connection:', err);
            if (err) {
                restartApp();
            }
        });
    });

    return dbConnection;
};

function restartApp() {
    console.error('Restarting the app...');
    // Add your logic to restart the app, e.g., using a process manager like PM2
    exec('pm2 restart staff_back', (err, stdout, stderr) => {
        if (err) {
            console.error('Failed to restart the app using PM2:', err);
            process.exit(1);
        } else {
            console.log("Restarted...");
        }
    });
}

module.exports = {
    getDbConnection
};
