// Error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Handle multer errors
  if (err.name === "MulterError") {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "File too large. Maximum size is 10MB.",
      });
    }
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  // Handle validation errors
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((val) => val.message);
    return res.status(400).json({
      success: false,
      message: messages.join(", "),
    });
  }

  // Handle duplicate key errors
  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      message: "Duplicate field value entered",
    });
  }

  // Handle cast errors (invalid IDs)
  if (err.name === "CastError") {
    return res.status(404).json({
      success: false,
      message: `Resource not found with id of ${err.value}`,
    });
  }

  // Default server error
  res.status(500).json({
    success: false,
    message: err.message || "Something went wrong on the server",
  });
};

module.exports = errorHandler;
