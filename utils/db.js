require('dotenv').config();
const db = require('mssql');

module.exports = {
    connectDatabase: async function connectDatabase(configObject) {
        try {
            const pool = new db.ConnectionPool(configObject);
            const connection = await pool.connect();
            console.log(connection.connected);//
            return configObject;
        } catch (error) {
            console.log(error);
            throw(error);
        }
    },
        db: db,
    };
   