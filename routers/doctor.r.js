const app = require("express");
const router = app.Router();

const doctorController = require('../controllers/doctor.c');
router.get("/", doctorController.renderOption);


module.exports = router;