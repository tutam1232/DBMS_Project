const app = require("express");
const router = app.Router();

const doctorController = require('../controllers/doctor.c');
router.get("/", doctorController.renderOption);
router.get("/viewAppointment", doctorController.renderViewAppointment);

module.exports = router;