const asyncHandler = require("express-async-handler");
const { Product } = require("../db");

// @desc Get all products
// @route: GET /api/products/
// @access: Private
const getAllProduct = asyncHandler(async (req, res, next) => {
  const products = await Product.findAll();
  res.status(200).json(products);
});

module.exports = {
  getAllProduct,
};
