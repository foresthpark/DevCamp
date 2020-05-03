const ErrorResponse = require("../utils/ErrorResponse");
const colors = require("colors");

const errorHandlerFunction = (err, req, res, next) => {
  let error = { ...err };

  error.message = err.message;

  // Log to console for developer
  console.log(err.stack.red.underline);
  console.log(err.name);
  console.log(err);

  // Error for Bad Object ID
  if (err.name === "CastError") {
    console.log(colors.yellow(err));
    const message = `Resource not found with id of: ${err.value}`;
    error = new ErrorResponse(message, 404);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || "Server Error",
  });
};

module.exports = errorHandlerFunction;
