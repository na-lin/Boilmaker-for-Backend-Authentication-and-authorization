const express = require("express");
const morgan = require("morgan");
const app = express();

app.use(morgan("dev"));
app.use(express.json());

// @desc Test route
app.get("/test", (req, res) => {
  res.send("APP for Learning Auth");
});

module.exports = app;
