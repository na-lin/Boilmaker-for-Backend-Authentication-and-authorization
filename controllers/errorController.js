const AppError = require("../utils/appError");
// @desc 404 Not Found error message
// @route -
// @access -
const notFound = (req, res, next) => {
  const error = new AppError(`Not Found - ${req.originalUrl}`, 404);
  next(error);
};

const handleValidationErrorDB = (err) => {
  const originalError = Object.values(err)[1][0].original;
  originalError.message = Object.values(err)[1][0].message;
  return originalError;
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // programming or other unknown error
    console.error("ERROR 💥", err);

    res.status(500).json({
      status: "error",
      message:
        "Something went very wrong! Please wait for a second then try it again.",
      err,
    });
  }
};

// @desc Global Error handler
// @route -
// @access -
const glbalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else {
    let error = { ...err };
    error.message = err.message;

    if (err.name === "SequelizeValidationError") {
      error = handleValidationErrorDB(error);
    }

    sendErrorProd(error, res);
  }
};

module.exports = {
  notFound,
  glbalErrorHandler,
};
