const app = require("express");
const router = app.Router();

const adminController = require('../controllers/admin.c');
router.get("/", adminController.renderOption);
router.get("/viewMedicine", adminController.renderViewMedicine);
router.get("/addMedicine", adminController.rederAddMedicine);
router.post("/addMedicine", adminController.rederAddMedicine);
router.get("/updateMedicine", adminController.renderUpdateMedicine);
router.post("/updateMedicine", adminController.renderUpdateMedicine);
router.get("/updateMedicine_volume", adminController.renderUpdateMedicine_volume);
router.post("/updateMedicine_volume", adminController.renderUpdateMedicine_volume);

module.exports = router;