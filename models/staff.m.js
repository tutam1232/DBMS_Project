const db = require('../utils/db');

module.exports = {

    addAppointment: async function (req, res, next) {
        if (!req.session.config)
            res.redirect('/');
        const { maphieu, manhashi, ngaykham, thutuca, sdtkhachhang } = req.body;
        console.log(maphieu, manhashi, ngaykham, thutuca, sdtkhachhang)

        const pool = new db.db.ConnectionPool(req.session.config);
        const connection = await pool.connect();
        const Request = new db.db.Request(connection);

        Request.input('MaPhieu', db.db.VarChar, maphieu);
        Request.input('NhaSiKham', db.db.VarChar, manhashi);
        Request.input('Ngay', db.db.Date, new Date(ngaykham));
        Request.input('ThuTuCa', db.db.Int, thutuca);
        Request.input('SdtKhachHang', db.db.VarChar, sdtkhachhang);  
        
        //console.log(Request)

        const result1 = await Request.execute('sp_ThemLichHen', (err, result) => {
            if (err) {
                console.log(err);
                
            }          
            
        });
        //console.log(result1);
    },

    selectAppointment: async function (req, res, next) {
        if (!req.session.config)
            res.redirect('/');

        const pool = new db.db.ConnectionPool(req.session.config);
        const connection = await pool.connect();
        const Request = new db.db.Request(connection);

        //use request to query select*from phieuhen 
        const result1 = await Request.query('select * from PhieuHen');
        //get result from query

        return result1.recordset;
    }

}