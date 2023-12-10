const staffModel = require('../models/staff.m');

module.exports = {
    renderOption: async function renderOption(req, res, next) {
        if (!req.session.user)
            res.redirect('/');
        res.render("staff/option", {
            title: "Staff Option",
            logout:true
        });
    },
    renderEditAppoinment: async function renderEditAppoinment(req, res, next) {
        if (!req.session.user)
            res.redirect('/');

        const PhieuHen = await staffModel.selectAppointment(req, res, next);
        

        res.render("staff/editAppointment", {
            title: "Staff Edit Appoinment",
            PhieuHen: PhieuHen,
            logout:true
        });
    },
    addAppointment: async function addAppoinment(req, res, next) {
        
        if(req.session.resolve == false)
            staffModel.addAppointment(req, res, next);
        else
            staffModel.addAppoitment_resolve(req, res, next);
        res.redirect('/staff/editAppoinment');
    }
}