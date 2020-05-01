const express = require("express");
const dotenv = require("dotenv");
const morgan = require('morgan');
const connectDB = require('./config/db');
const colors = require('colors');

const app = express();

// Load env variables
dotenv.config({
  path: "./config/config.env",
});

// Connect to DB
connectDB();

// Import Routes
const bootcamps = require("./routes/bootcamps");



// Dev logging middle where
if(process.env.NODE_ENV === "development") {
  app.use(morgan('dev'));
}

// Middleware
app.use("/api/v1/bootcamps", bootcamps);

// Listen

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () =>
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port: ${PORT} 🚀`.yellow.bold
  )
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err,promise) => {
  console.log(`Error: ${err.message}`.red
  );

  // Close server and exit process
  server.close(() => process.exit(1));
})
