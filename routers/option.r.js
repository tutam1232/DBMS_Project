const app = require("express");
const router = app.Router();

const optionController = require('../controllers/option.c');
router.get("/", optionController.renderOption);

// router.get("/", accController.getLogin);
// router.post("/", accController.postLogin);
// router.get("/register", accController.getRegister);
// router.post("/register", accController.postRegister);
// router.post("/logout", accController.postLogout);

module.exports = router;