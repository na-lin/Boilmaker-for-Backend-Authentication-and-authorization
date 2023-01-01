const express = require("express");
const { getAllProduct } = require("../controllers/productController");
const { protect } = require("../controllers/authController");
const router = express.Router();

router.route("/").get(protect, getAllProduct);

module.exports = router;
