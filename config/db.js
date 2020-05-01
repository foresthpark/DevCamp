const mongoose = require('mongoose');
const dotenv = require("dotenv");

dotenv.config({
  path: "./config/config.env",
});

const MONGO_URI = process.env.MONGO_URI;

const connectDB = async () => {
  const connection = await mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });

  console.log(`MongoDB Connected 🧨: ${connection.connection.host}`.underline.cyan.bold);
}

module.exports = connectDB;