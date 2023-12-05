const app = require("express");
const router = app.Router();

const loginController = require('../controllers/login.c');
router.get("/", loginController.renderLogin);

// router.get("/", accController.getLogin);
// router.post("/", accController.postLogin);
// router.get("/register", accController.getRegister);
// router.post("/register", accController.postRegister);
// router.post("/logout", accController.postLogout);

module.exports = router;