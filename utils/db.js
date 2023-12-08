require('dotenv').config();
const db = require('mssql');

module.exports = {
        connectDatabase: async function connectDatabase(configObject) {
            try {
                await db.connect(configObject);
            }
            catch (error) {
                //console.log(error)
                throw(error)
                
            }
        },
        db: db,
    };
   