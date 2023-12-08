const app = require("express");
const router = app.Router();

const loginController = require('../controllers/login.c');
router.get("/", loginController.renderLoginChoice);

router.get("/:userType", loginController.renderLogin);
router.post("/:userType", loginController.postLogin);//

module.exports = router;