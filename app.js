const express = require("express");
const morgan = require("morgan");
const app = express();
const {
  notFound,
  glbalErrorHandler,
} = require("./controllers/errorController");

app.use(morgan("dev"));
app.use(express.json());

// @desc Test route
app.get("/test", (req, res) => {
  res.send("APP for Learning Auth");
});

// @desc: router for users and prducts
app.use("/api/users", require("./routes/userRouter"));
app.use("/api/products", require("./routes/productRouter"));

app.use(notFound);

app.use(glbalErrorHandler);

module.exports = app;
