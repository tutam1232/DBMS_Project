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
    }
}