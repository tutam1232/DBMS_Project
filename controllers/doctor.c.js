const doctorModel = require('../models/doctor.m');

module.exports = {
    renderOption: async function renderOption(req, res, next) {
        if(!req.session.user)
            res.redirect('/');
        res.render("doctor/option", {
            title: "Doctor Option",
            logout:true
        });
    },
    renderViewAppointment: async function renderViewAppointment(req, res, next) {
        if(!req.session.user)
            res.redirect('/');
        let PhieuHen = null;
        if(req.session.resolve == false)
            PhieuHen = await doctorModel.selectAppointment(req, res, next);
        else
            PhieuHen = await doctorModel.selectAppointment_resolve(req, res, next);
        const LichCaNhan = await doctorModel.selectPersonalSchedule(req, res, next);

        res.render("doctor/viewAppointment", {
            title: "View Appointment",
            PhieuHen: PhieuHen,
            LichCaNhan: LichCaNhan,
            logout:true
        });
    },
    rederAddPersonalSchedule: async function renderAddPersonalSchedule(req, res, next) {
        if(!req.session.user)
            res.redirect('/');
        const LichCaNhan = await doctorModel.selectPersonalSchedule(req, res, next);
        if(req.session.resolve == false)
            doctorModel.insertPersonalSchedule(req, res, next);
        else
            doctorModel.insertPersonalSchedule_resolve(req, res, next);

        res.render("doctor/addPersonalSchedule", {
            title: "Add Personal Schedule",
            LichCaNhan: LichCaNhan,
            logout:true
        });
    },
    renderSaveCustomerInfo: async function (req,res,next) {
        if(!req.session.user)
            res.redirect('/');
        const data = await doctorModel.selectBenhAn(req,res,next);
        res.render("doctor/saveCustomerInfo",{
            title: "Bệnh án",
            benhan: data,
            logout: true
        })
    },
    chiTietDonThuoc_get: async function (req,res,next) {
        if (!req.session.config)
            res.redirect('/');
        const data = await doctorModel.selectChiTietDonThuoc(req,res,next);
        res.render('doctor/drugDetail',{
            logout:true,
            title: "Chi tiết đơn thuốc",
            donthuoc: data
        })
    },
    chiTietDonThuoc_post: async function (req,res,next) {
        if (!req.session.config)
            res.redirect('/');
        req.query.maba = req.body.maba;
        req.query.sdt = req.body.sdt;
        if (req.session.resolve == false) {
            req.body.sp = 'sp_ThemChiTietDonThuoc1';
        }
        else {
            req.body.sp = 'sp_ThemChiTietDonThuoc1_Fix';
        }
        await doctorModel.insertChiTietDonThuoc(req,res,next);
        const data = await doctorModel.selectChiTietDonThuoc(req,res,next);
        res.render('doctor/drugDetail',{
            logout:true,
            title: "Chi tiết đơn thuốc",
            donthuoc: data
        })
    }
}