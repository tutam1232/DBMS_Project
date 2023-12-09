const staffModel = require('../models/staff.m');
const db = require('../utils/db');

module.exports = {
    renderOption: async function renderOption(req, res, next) {
        if (!req.session.user)
            res.redirect('/');
        res.render("staff/option", {
            title: "Staff Option",
        });
    },
    renderEditAppoinment: async function renderEditAppoinment(req, res, next) {
        if (!req.session.user)
            res.redirect('/');

        const PhieuHen = await staffModel.selectAppointment(req, res, next);
        

        res.render("staff/editAppointment", {
            title: "Staff Edit Appoinment",
            PhieuHen: PhieuHen
        });
    },
    addAppointment: async function addAppoinment(req, res, next) {
        
        staffModel.addAppointment(req, res, next);
        res.redirect('/staff/editAppoinment');
    }
}