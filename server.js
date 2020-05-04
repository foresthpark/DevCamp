const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const connectDB = require("./config/db");
const colors = require("colors");
const errorHandlerFunction = require("./middleware/error");

// Import Routes
const bootcamps = require("./routes/bootcamps");
const courses = require("./routes/courses");

const app = express();
app.use(express.json()); // Body Parser

// Load env variables
dotenv.config({
  path: "./config/config.env",
});

// Connect to DB
connectDB();

// Middleware
app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/v1/courses", courses);

app.use(errorHandlerFunction); // Custom error handler

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Listen

const PORT = process.env.PORT || 5005;

const server = app.listen(PORT, () =>
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port: ${PORT} 🚀`.yellow
      .bold
  )
);

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red);

  // Close server and exit process
  server.close(() => process.exit(1));
});
