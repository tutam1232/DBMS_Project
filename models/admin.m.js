const db = require('../utils/db');
const loginModel = require('../models/login.m');

module.exports = {
    selectMedicine: async function (req, res, next) {
        if (!req.session.config)
            res.redirect('/');

        //let MaThuoc = req.session.user;
        console.log(req.query, req.body)
        const pool = new db.db.ConnectionPool(req.session.config);
        const connection = await pool.connect();
        const Request = new db.db.Request(connection);

        let TimTheoMaThuoc = req.query.TimTheoMaThuoc;
        if (TimTheoMaThuoc == undefined)
            return null;
        //Request.input('MaThuoc', db.db.VarChar, req.session.user);
        Request.input('MaThuoc', db.db.VarChar, TimTheoMaThuoc);


        try {
            const result1 = await Request.execute('sp_XemThongTinThuoc');
            //console.log(result1.recordset);
            return result1.recordset;
        } catch (err) {
            console.log(err);
            return null;
        }
    },

    selectMedicine_resolve: async function (req, res, next) {
        if (!req.session.config)
            res.redirect('/');

        //let MaThuoc = req.session.user;
        const pool = new db.db.ConnectionPool(req.session.config);
        const connection = await pool.connect();
        const Request = new db.db.Request(connection);


        let TimTheoMaThuoc = req.query.TimTheoMaThuoc;
        if (TimTheoMaThuoc == undefined)
            return null;
        //Request.input('MaThuoc', db.db.VarChar, req.session.user);
        Request.input('MaThuoc', db.db.VarChar, TimTheoMaThuoc);


        try {
            const result1 = await Request.execute('sp_XemThongTinThuoc_Fix');
            //console.log(result1.recordset);
            return result1.recordset;
        } catch (err) {
            console.log(err);
            return null;
        }
    },

    insertMedicine: async function (req, res, next) {
        if (!req.session.config)
            res.redirect('/');

        let { mathuoc, tenthuoc, donvitinh, chidinh, soluongton, ngayhethan } = req.body;
        console.log(mathuoc, tenthuoc, donvitinh, chidinh, soluongton, ngayhethan)

        const pool = new db.db.ConnectionPool(req.session.config);
        const connection = await pool.connect();
        const Request = new db.db.Request(connection);

        Request.input('MaThuoc', db.db.VarChar, mathuoc);
        Request.input('TenThuoc', db.db.VarChar, tenthuoc);
        Request.input('DonViTinh', db.db.VarChar, donvitinh);
        Request.input('ChiDinh', db.db.VarChar, chidinh);
        Request.input('SoLuongTon', db.db.Int, soluongton);
        Request.input('NgayHetHan', db.db.Date, new Date(ngayhethan));
        //console.log(Request.input)

        //use request to query select*from phieuhen 
        const result1 = await Request.execute('sp_ThemThongTinThuoc', (err, result) => {
            if (err) {
                console.log(err);
            }
        });
        //get result from query
        //console.log(result1);
    },

    insertMedicine_resolve: async function (req, res, next) {
        if (!req.session.config)
            res.redirect('/');

        let { mathuoc, tenthuoc, donvitinh, chidinh, soluongton, ngayhethan } = req.body;
        console.log(mathuoc, tenthuoc, donvitinh, chidinh, soluongton, ngayhethan)

        const pool = new db.db.ConnectionPool(req.session.config);
        const connection = await pool.connect();
        const Request = new db.db.Request(connection);

        Request.input('MaThuoc', db.db.VarChar, mathuoc);
        Request.input('TenThuoc', db.db.VarChar, tenthuoc);
        Request.input('DonViTinh', db.db.VarChar, donvitinh);
        Request.input('ChiDinh', db.db.VarChar, chidinh);
        Request.input('SoLuongTon', db.db.Int, soluongton);
        Request.input('NgayHetHan', db.db.Date, new Date(ngayhethan));
        //console.log(Request.input)

        //use request to query select*from phieuhen 
        const result1 = await Request.execute('sp_ThemThongTinThuoc_Fix', (err, result) => {
            if (err) {
                console.log(err);

            }

        });
        //get result from query
        //console.log(result1);
    },

    updateMedicine: async function (req, res, next) {
        if (!req.session.config)
            res.redirect('/');

        let { MaThuoc, TenThuoc, DonViTinh, ChiDinh, SoLuongTon, NgayHetHan } = req.body;

        const pool = new db.db.ConnectionPool(req.session.config);
        const connection = await pool.connect();
        const Request = new db.db.Request(connection);

        Request.input("MaThuoc", db.db.VarChar, MaThuoc);
        Request.input("TenThuoc", db.db.NVarChar, TenThuoc);
        Request.input("DonViTinh", db.db.NVarChar, DonViTinh);
        Request.input("ChiDinh", db.db.NVarChar, ChiDinh);
        Request.input("SoLuongTon", db.db.Int, SoLuongTon);
        Request.input("NgayHetHan", db.db.Date, new Date(NgayHetHan));

        console.log(MaThuoc, TenThuoc, DonViTinh, ChiDinh, SoLuongTon, NgayHetHan);

        const result1 = await Request.execute("sp_SuaThuoc", (err, result) => {
            if (err) {
                console.log(err);
            }
        });

    },

    updateMedicine_resolve: async function (req, res, next) {
        if (!req.session.config)
            res.redirect('/');

        let { MaThuoc, TenThuoc, DonViTinh, ChiDinh, SoLuongTon, NgayHetHan } = req.query;

        const pool = new db.db.ConnectionPool(req.session.config);
        const connection = await pool.connect();
        const Request = new db.db.Request(connection);

        Request.input("MaThuoc", db.db.VarChar, MaThuoc);
        Request.input("TenThuoc", db.db.NVarChar, TenThuoc);
        Request.input("DonViTinh", db.db.NVarChar, DonViTinh);
        Request.input("ChiDinh", db.db.NVarChar, ChiDinh);
        Request.input("SoLuongTon", db.db.Int, SoLuongTon);
        Request.input("NgayHetHan", db.db.Date, new Date(NgayHetHan));

        const result1 = await Request.execute("sp_SuaThuoc_Fix", (err, result) => {
            if (err) {
                console.log(err);
            }
        });

        console.log(result1);
    },



    UpdateMedicine_volume: async function (req, res, next){
        if (!req.session.config)
            res.redirect('/');

        let { MaThuoc, SoLuongTon } = req.body;

        const pool = new db.db.ConnectionPool(req.session.config);
        const connection = await pool.connect();
        const Request = new db.db.Request(connection);

        Request.input("MaThuoc", db.db.VarChar, MaThuoc);
        Request.input("soluongcapnhat", db.db.Int, SoLuongTon);

        console.log(MaThuoc, SoLuongTon);

        const result1 = await Request.execute("Update_SoLuongThuoc", (err, result) => {
            if (err) {
                console.log(err);
            }
        });
    },
    UpdateMedicine_volume_resolve: async function (req, res, next){
        if (!req.session.config)
            res.redirect('/');

        let { MaThuoc, SoLuongTon } = req.body;

        const pool = new db.db.ConnectionPool(req.session.config);
        const connection = await pool.connect();
        const Request = new db.db.Request(connection);

        Request.input("MaThuoc", db.db.VarChar, MaThuoc);
        Request.input("soluongcapnhat", db.db.Int, SoLuongTon);

        console.log(MaThuoc, SoLuongTon);

        const result1 = await Request.execute("Update_SoLuongThuoc_fix", (err, result) => {
            if (err) {
                console.log(err);
            }
        });
    }
}