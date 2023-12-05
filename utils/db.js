require('dotenv').config();

const pgp = require('pg-promise')({
    capSQL: true
});

const connectString = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DB,
    user: process.env.DB_USER,
    password: process.env.DB_PW,
}


const db = pgp(connectString);
module.exports = {
    initDatabase: async function initDatabase() {
        try {
            // Kiểm tra xem database đã tồn tại chưa
            const databaseExists = await db.oneOrNone(
                'SELECT 1 FROM pg_database WHERE datname = $1',
                process.env.DB_NAME
            );
    
            if (!databaseExists) {
                // tạo mới database
                await db.none(`CREATE DATABASE ${process.env.DB_NAME}`);
                console.log(`Database ${process.env.DB_NAME} created.`);
    
                // kết nối đến database mới tạo
                db.$pool.options.database = process.env.DB_NAME;
                await db.connect();
    
                // tạo bảng trong database
                await db.none(`
                
               
                `);     
    
                console.log(`Tables created inside '${process.env.DB_NAME}' database.`);
                console.log(`Data imported into '${process.env.DB_NAME}' database.`);
            }
            else {
                db.$pool.options.database = process.env.DB_NAME;
                await db.connect();
                console.log(`Database '${process.env.DB_NAME}' already exists. Cannot create database.`);
            }
        }
        catch (error) {
            console.log(error);
        }
    },
    db: db,
};
