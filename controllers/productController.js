const asyncHandler = require("express-async-handler");
const { Product } = require("../db");

// @desc Get all products
// @route: GET /api/products/
// @access: Private
const getAllProduct = asyncHandler(async (req, res, next) => {
  const products = await Product.findAll();
  res.status(200).json({
    status: "success",
    results: products.length,
    data: {
      products,
    },
  });
});

// @desc Create new product
// @route: POST /api/products/
// @access: Private & only allow admin to create new product
const createNewProduct = asyncHandler(async (req, res, next) => {
  const { name, price, brand, category, countInStock } = req.body;
  const newProduct = await Product.create({
    name,
    price,
    brand,
    category,
    countInStock,
  });
  res.status(200).json(newProduct);
});

module.exports = {
  getAllProduct,
  createNewProduct,
};
