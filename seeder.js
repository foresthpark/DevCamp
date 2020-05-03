const fs = require("fs");
const mongoose = require("mongoose");
const colors = require("colors");
const dotenv = require("dotenv");

dotenv.config({
  path: "./config/config.env",
});

// Load models
const Bootcamp = require("./models/Bootcamp");

// Connect to DB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

// Read JSON files
const bootcamps = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/bootcamps.json`, "utf-8")
);

// Load data into DB
const loadDataToDB = async () => {
  try {
    await Bootcamp.create(bootcamps);
    console.log("Data Successfully Loaded to DB".green.inverse);

    process.exit();
  } catch (err) {
    console.log(err);
  }
};

// Delete data
const deleteDataFromDB = async () => {
  try {
    await Bootcamp.deleteMany();
    console.log("Data in DB Successfully Destroyed".red.inverse);

    process.exit();
  } catch (err) {
    console.log(err);
  }
};

if (process.argv[2] === "-i") {
  loadDataToDB();
} else if (process.argv[2] === "-d") {
  deleteDataFromDB();
}
