const express = require("express");
const {
  signup,
  login,
  protect,
  restrictTo,
} = require("../controllers/authController");

const {
  updatePassword,
  updateMe,
  deleteMe,
  getAllUsers,
} = require("../controllers/userController");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

router.put("/updateMypassword", protect, updatePassword);
router.put("/updateMe", protect, updateMe);
router.delete("/deleteMe", protect, deleteMe);

router.route("/").get(protect, restrictTo("admin"), getAllUsers);

module.exports = router;
