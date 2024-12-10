const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const { getDbConnection } = require('./database.js');
const routes = require('./routes');

app.use(bodyParser.json());
app.use(cors({ origin: "*" }));

app.use((req, res, next) => {
    const host = req.headers.host.split(':')[0]; // Extract the domain without the port

    try {
        req.dbConnection = getDbConnection(host);
        next();
    } catch (err) {
        console.error('Error setting up database connection:', err);
    }
});

app.use('/api', routes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    return res.status(500).send('Something broken!');
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));