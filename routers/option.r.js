const app = require("express");
const router = app.Router();

const optionController = require('../controllers/option.c');
router.get("/", optionController.renderOption);


module.exports = router;