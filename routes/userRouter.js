const express = require("express");
const { signup, login, protect } = require("../controllers/authController");

const { updatePassword, updateMe } = require("../controllers/userController");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

router.put("/updateMypassword", protect, updatePassword);
router.put("/updateMe", protect, updateMe);

module.exports = router;
