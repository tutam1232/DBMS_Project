const adminModel = require('../models/admin.m');

module.exports = {
    renderOption: async function renderOption(req, res, next) {
        if (!req.session.user)
            res.redirect('/');
        res.render("admin/option", {
            title: "Admin Option",
            logout:true
        });
    },
    renderViewMedicine: async function renderViewMedicine(req, res, next) {
      if(!req.session.user)
          res.redirect('/');
      let ThongTinThuoc = null;
      if(req.session.resolve == false)
          ThongTinThuoc = await adminModel.selectMedicine(req, res, next);
      else
          ThongTinThuoc = await adminModel.selectMedicine_resolve(req, res, next);
      //const LichCaNhan = await adminModel.selectPersonalSchedule(req, res, next);

      res.render("admin/viewMedicine", {
          title: "View Medicine",
          ThongTinThuoc: ThongTinThuoc,
          logout:true
      });
    },
    rederAddMedicine: async function renderAddMedicine(req, res, next) {
      if(!req.session.user)
          res.redirect('/');

      //const LichCaNhan = await doctorModel.selectPersonalSchedule(req, res, next);
      if(req.session.resolve == false)
          adminModel.insertMedicine(req, res, next);
      else
          adminModel.insertMedicine_resolve(req, res, next);

      res.render("admin/addMedicine", {
          title: "Add Medicine",
          //LichCaNhan: LichCaNhan,
          logout:true
      });
    },
}