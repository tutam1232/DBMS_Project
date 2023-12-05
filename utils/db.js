require('dotenv').config();
const db = require('mssql');

var config = {
    server: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PW,
    driver: 'msnodesqlv8',
    port: parseInt(process.env.DB_PORT),
    options: {
        trustedConnection: true,
        trustServerCertificate: true 
    }
}
module.exports = {
        connectDatabase: async function connectDatabase() {
            try {
                db.connect(config);
            }
            catch (error) {
                //console.log(error)
                throw(error)
                
            }
        },
        db: db,
    };
   