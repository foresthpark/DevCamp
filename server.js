const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const connectDB = require("./config/db");
const colors = require("colors");
const cookieParser = require("cookie-parser");
const errorHandlerFunction = require("./middleware/error");
const fileUpload = require("express-fileupload");

const app = express();
app.use(cookieParser()); // Parse cookie header and populate req.cookies
app.use(express.json()); // Body Parser
app.use(fileUpload()); // File upload middleware. Allows access to req.body.files

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

// Import Routes
const bootcamps = require("./routes/bootcamps");
const courses = require("./routes/courses");
const auth = require("./routes/auth");

// Load env variables
dotenv.config({
  path: "./config/config.env",
});

// Connect to DB
connectDB();

// Mount routes
app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/v1/courses", courses);
app.use("/api/v1/auth", auth);

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
      .bold.inverse
  )
);

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red);

  // Close server and exit process
  server.close(() => process.exit(1));
});
