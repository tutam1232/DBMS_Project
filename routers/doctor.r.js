const app = require("express");
const router = app.Router();

const doctorController = require('../controllers/doctor.c');
router.get("/", doctorController.renderOption);
router.get("/viewAppointment", doctorController.renderViewAppointment);
router.get("/addPersonalSchedule", doctorController.rederAddPersonalSchedule);
router.post("/addPersonalSchedule", doctorController.rederAddPersonalSchedule);
router.get("/saveCustomerInfo",doctorController.renderSaveCustomerInfo);
router.get("/saveCustomerInfo/drugDetail",doctorController.chiTietDonThuoc_get);
router.post("/saveCustomerInfo/DrugDetail",doctorController.chiTietDonThuoc_post);
module.exports = router;