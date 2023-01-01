const express = require("express");
const {
  signup,
  login,
  protect,
  restrictTo,
  forgetPassword,
  resetPassword,
} = require("../controllers/authController");

const {
  testForFilter,
  updatePassword,
  updateMe,
  deleteMe,
  getAllUsers,
} = require("../controllers/userController");

const router = express.Router();

// test for beforeFind hook to exclude active = false
router.get("/test", testForFilter);

router.post("/signup", signup);
router.post("/login", login);

router.post("/forgotPassword", forgetPassword);
router.post("/resetPassword/:token", resetPassword);

router.put("/updateMypassword", protect, updatePassword);
router.put("/updateMe", protect, updateMe);
router.delete("/deleteMe", protect, deleteMe);

router.route("/").get(protect, restrictTo("admin"), getAllUsers);

module.exports = router;
