const db = require('../utils/db');

module.exports = {
    selectAppointment: async function (req, res, next) {
        if (!req.session.config)
            res.redirect('/');

        let MaNhaSi = req.session.user;
        console.log(req.query, req.body)
        const pool = new db.db.ConnectionPool(req.session.config);
        const connection = await pool.connect();
        const Request = new db.db.Request(connection);

        let lichhen_ngay = req.query.lichhen_ngay;
        if (lichhen_ngay == undefined)
            return null;
        Request.input('MaNhaSi', db.db.VarChar, req.session.user);
        Request.input('Ngay', db.db.Date, new Date(lichhen_ngay));

        try {
            const result1 = await Request.execute('sp_XemLichHen');
            //console.log(result1.recordset);
            return result1.recordset;
        } catch (err) {
            console.log(err);
            return null;
        }
    },
    selectAppointment_resolve: async function (req, res, next) {
        if (!req.session.config)
            res.redirect('/');

        let MaNhaSi = req.session.user;
        const pool = new db.db.ConnectionPool(req.session.config);
        const connection = await pool.connect();
        const Request = new db.db.Request(connection);

        let lichhen_ngay = req.query.lichhen_ngay;
        if (lichhen_ngay == undefined)
            return null;
        Request.input('MaNhaSi', db.db.VarChar, req.session.user);
        Request.input('Ngay', db.db.Date, new Date(lichhen_ngay));

        try {
            const result1 = await Request.execute('sp_XemLichHen_Fix');
            //console.log(result1.recordset);
            return result1.recordset;
        } catch (err) {
            console.log(err);
            return null;
        }
    },

    selectPersonalSchedule: async function (req, res, next) {
        if (!req.session.config)
            res.redirect('/');

        let MaNhaSi = req.session.user;
        const pool = new db.db.ConnectionPool(req.session.config);
        const connection = await pool.connect();
        const Request = new db.db.Request(connection);

        //use request to query select*from phieuhen 
        const result1 = await Request.input('MaNhaSi', db.db.VarChar, MaNhaSi).query('select * from LichCaNhan where MaNhaSi = @MaNhaSi');
        //get result from query

        return result1.recordset;
    },


    insertPersonalSchedule: async function (req, res, next) {
        if (!req.session.config)
            res.redirect('/');

        let MaNhaSi = req.session.user;
        console.log(req.body)
        console.log("-----------1----------------")
        console.log(req.query)
        console.log("-----------2----------------")
        let Ngay = req.body.ngaykham;
        let Ca = req.body.thutuca;

        console.log(MaNhaSi, Ngay, Ca)

        const pool = new db.db.ConnectionPool(req.session.config);
        const connection = await pool.connect();
        const Request = new db.db.Request(connection);

        Request.input('MaNhaSi', db.db.VarChar, MaNhaSi);
        Request.input('Ngay', db.db.Date, Ngay);
        Request.input('Ca', db.db.Int, Ca);
        console.log(Request.input)

        //use request to query select*from phieuhen 
        const result1 = await Request.execute('sp_Insert_LichCaNhan', (err, result) => {
            if (err) {
                console.log(err);

            }

        });
        //get result from query
        console.log(result1);
    },

    insertPersonalSchedule_resolve: async function (req, res, next) {
        if (!req.session.config)
            res.redirect('/');

        let MaNhaSi = req.session.user;
        let { Ngay, ThuTuCa } = req.body;
        console.log(Ngay, ThuTuCa)

        const pool = new db.db.ConnectionPool(req.session.config);
        const connection = await pool.connect();
        const Request = new db.db.Request(connection);

        Request.input('MaNhaSi', db.db.VarChar, MaNhaSi);
        Request.input('Ngay', db.db.Date, new Date(Ngay));
        Request.input('ThuTuCa', db.db.Int, ThuTuCa);

        //use request to query select*from phieuhen 
        const result1 = await Request.execute('sp_Insert_LichCaNhan_fix', (err, result) => {
            if (err) {
                console.log(err);

            }

        });
        //get result from query
        //console.log(result1);
    },
    selectBenhAn: async function (req, res, next) {
        if (!req.session.config)
            res.redirect('/');
        const pool = new db.db.ConnectionPool(req.session.config);
        const connection = await pool.connect();
        const Request = new db.db.Request(connection);
        const rs = await Request.query('select * from BENHAN');
        return rs.recordset;
    },
    selectChiTietDonThuoc: async function (req, res, next) {
        if (!req.session.config)
            res.redirect('/');
        const maba = req.query.maba;
        const sdt = req.query.sdt;
        const pool = new db.db.ConnectionPool(req.session.config);
        const connection = await pool.connect();
        const Request = new db.db.Request(connection);
        Request.input('MaBenhAn', db.db.VarChar, maba);
        Request.input('Sdt', db.db.VarChar, sdt);
        const rs = await Request.query('select * from CHITIETDONTHUOC where MaBenhAn = @MaBenhAn and SdtKhachHang = @Sdt');
        return rs.recordset;
    },
    insertChiTietDonThuoc: async function (req, res, next) {
        if (!req.session.config)
            res.redirect('/');

        let mathuoc = req.body.mathuoc;
        let sdt = req.body.sdt;
        let maba = req.body.maba;
        let sl = req.body.sl;
        let sp = req.body.sp;
        const pool = new db.db.ConnectionPool(req.session.config);
        const connection = await pool.connect();
        const Request = new db.db.Request(connection);

        Request.input('mathuoc', db.db.VarChar, mathuoc);
        Request.input('sdt', db.db.VarChar, sdt);
        Request.input('maba', db.db.VarChar, maba);
        Request.input('sl', db.db.Int, sl);
        //use request to query select*from phieuhen 
        const result1 = await Request.execute(sp, (err, result) => {
            if (err) {
                console.log(err);
            }
        });
    },
}