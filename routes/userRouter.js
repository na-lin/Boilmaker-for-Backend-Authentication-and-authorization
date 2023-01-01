const express = require("express");
const { signup, login, protect } = require("../controllers/authController");

const { updatePassword } = require("../controllers/userController");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

router.route("/updateMypassword").put(protect, updatePassword);

module.exports = router;
