const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, "Please add a course title"],
  },
  description: {
    type: String,
    required: [true, "Please add a description"],
  },
  weeks: {
    type: String,
    required: [true, "Please add a number of weeks"],
  },
  tuition: {
    type: Number,
    required: [true, "Please add a tuition amount"],
  },
  minimumSkill: {
    type: String,
    required: [true, "Please add a description of require minimum skill"],
    enum: ["beginner", "intermediate", "advanced"],
  },
  scholarshipAvailable: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  bootcamp: {
    type: mongoose.Schema.Types.ObjectID,
    ref: "Bootcamp",
    required: true,
  },
});

// Static method to calculate Average of Course tuition of bootcamp
// Static methods must be run on the model
CourseSchema.statics.getAverageCost = async function (bootcampId) {
  console.log("Calculating average cost...".blue.inverse);

  const obj = await this.aggregate([
    // Pipeline Step 1
    {
      $match: { bootcamp: bootcampId }, // Find bootcampId from Bootcamp collection
    },
    // Pipeline Step 2
    {
      $group: {
        // object you want to create
        _id: "$bootcamp",
        averageCost: { $avg: "$tuition" }, // run $avg on all tuition
      },
    },
  ]);

  try {
    await this.model("Bootcamp").findByIdAndUpdate(bootcampId, {
      averageCost: Math.ceil(obj[0].averageCost / 10) * 10,
    });
  } catch (err) {
    console.log(err);
  }
  console.log(obj);
};

// Call getAverageCost after Save
CourseSchema.post("save", function () {
  this.constructor.getAverageCost(this.bootcamp);
});

// Call getAverageCost before remove
CourseSchema.pre("remove", function () {
  this.constructor.getAverageCost(this.bootcamp);
});

module.exports = mongoose.model("Course", CourseSchema);
