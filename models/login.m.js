const db = require('../utils/db');

module.exports = {
    postLogin: async function (req, res, next) {
        const { username, password } = req.body;
        var config = {
            server: process.env.DB_HOST,
            database: process.env.DB_NAME,
            user: username,
            password: password,
            port: parseInt(process.env.DB_PORT),
            options: {
                //trustedConnection: false,
                trustServerCertificate: true
            }
        }

        const returnConfig = await db.connectDatabase(config);
        req.session.config = returnConfig;
        req.session.user = username;

        const secondPart = req.originalUrl.split('/')[2];
        req.session.userType = secondPart;
        console.log('dang nhap dc roi!!!', req.session.userType);//  
    },

    logout: async function (req, res, next) {
        req.session.destroy();
    },

    checkUserType: async function (req, res, next) {
        try {
            const pool = new db.db.ConnectionPool(req.session.config);
            const connection = await pool.connect();
            const Request = new db.db.Request(connection);

            let result = 0;

            switch (req.session.userType) {
                case 'staff':
                    result = await Request.query(`SELECT IS_ROLEMEMBER('NhanVien') AS IsMember`);
                    if (result.recordset[0].IsMember === 1) return 1;
                    break;
                case 'doctor':
                    result = await Request.query(`SELECT IS_ROLEMEMBER('NhaSi') AS IsMember`);
                    if (result.recordset[0].IsMember === 1) return 1;
                    break;
                case 'customer':
                    result = await Request.query("SELECT IS_ROLEMEMBER('KhachHang') AS IsMember");
                    if (result.recordset[0].IsMember === 1) return 1;
                    break;
                case 'admin':
                    result = await Request.query("SELECT IS_ROLEMEMBER ('QuanTriVien') AS IsMember");
                    if (result.recordset[0].IsMember === 1) return 1;
                    break;
                default:
                    break;
            }
            return 0;
        } catch (error) {
            console.log(error);
            return 0;
        }
    }

}