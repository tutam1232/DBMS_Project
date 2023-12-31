const app = require("express");
const router = app.Router();

const doctorController = require('../controllers/doctor.c');
router.get("/", doctorController.renderOption);
router.get("/viewAppointment", doctorController.renderViewAppointment);
router.get("/addPersonalSchedule", doctorController.rederAddPersonalSchedule);
router.post("/addPersonalSchedule", doctorController.rederAddPersonalSchedule);

module.exports = router;