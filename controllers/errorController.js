// @desc 404 Not Found error message
// @route -
// @access -
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// @desc Global Error handler
// @route -
// @access -
const glbalErrorHandler = (err, req, res, next) => {
  const statusCode = err.status
    ? err.status
    : res.statusCode === 200
    ? 500
    : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

module.exports = {
  notFound,
  glbalErrorHandler,
};
