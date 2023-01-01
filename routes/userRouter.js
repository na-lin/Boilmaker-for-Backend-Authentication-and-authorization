const express = require("express");
// const { signup } = require("../controllers/authController");

const { updatePassword } = require("../controllers/userController");

const router = express.Router();

router.route("/:id/updatepassword").put(updatePassword);

// router.post("/signup", signup);

module.exports = router;
