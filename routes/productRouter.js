const express = require("express");
const { getAllProduct } = require("../controllers/productController");

const router = express.Router();

router.route("/").get(getAllProduct);

module.exports = router;
