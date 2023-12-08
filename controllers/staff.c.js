const staffModel = require('../models/staff.m');

module.exports = {
    renderOption: async function renderOption(req, res, next) {
        if(!req.session.user)
            res.redirect('/');
        res.render("staff/option", {
            title: "Staff Option",
        });
    },
    renderEditAppoinment: async function renderEditAppoinment(req, res, next) {
        if(!req.session.user)
            res.redirect('/');


        res.render("staff/editAppoinment", {
            title: "Staff Edit Appoinment",
        });
    }
}