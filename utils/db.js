require('dotenv').config();
const e = require('express');
const db = require('mssql');

module.exports = {
    connectDatabase: async function connectDatabase(configObject) {
        try {
            const pool = new db.ConnectionPool(configObject);
            const connection = pool.connect();
            return connection;
        } catch (error) {
            console.log(error);
            throw(error);
        }
    },
        db: db,
    };
   