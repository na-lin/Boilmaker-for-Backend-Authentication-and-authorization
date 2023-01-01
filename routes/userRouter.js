const express = require("express");
const { signup, login } = require("../controllers/authController");

const { updatePassword } = require("../controllers/userController");

const router = express.Router();

router.route("/:id/updatepassword").put(updatePassword);

router.post("/signup", signup);
router.post("/login", login);

module.exports = router;
