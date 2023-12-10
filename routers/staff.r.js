const app = require("express");
const router = app.Router();


const staffController = require('../controllers/staff.c');
router.get("/", staffController.renderOption);
router.get("/editAppoinment", staffController.renderEditAppoinment);

router.post("/addAppointment", staffController.addAppointment);

module.exports = router;