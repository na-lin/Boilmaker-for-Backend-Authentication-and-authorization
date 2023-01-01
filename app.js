const express = require("express");
const morgan = require("morgan");
const app = express();

app.use(morgan("dev"));
app.use(express.json());

// @desc Test route
app.get("/test", (req, res) => {
  res.send("APP for Learning Auth");
});

// @desc: router for users and prducts
app.use("/api/users", require("./routes/userRouter"));
app.use("/api/products", require("./routes/productRouter"));

// @desc Create new user
// @route: POST /api/users/signup

// @desc 404 Not Found error message
// @route -
// @access -
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

// @desc Error handler
// @route -
// @access -
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

module.exports = app;
