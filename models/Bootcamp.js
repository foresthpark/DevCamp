const mongoose = require("mongoose");
const slugify = require("slugify");
const geocoder = require("../utils/GeoCoder");

const BootcampSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
      unique: true,
      trim: true,
      maxLength: [50, "Name cannot be longer than 50 characters"],
    },
    slug: String,
    description: {
      type: String,
      required: [true, "Please add a description"],
      maxLength: [500, "Description cannot be longer than 500 characters"],
    },
    website: {
      type: String,
      match: [
        /^((https?|ftp|smtp):\/\/)?(www.)?[a-z0-9]+\.[a-z]+(\/[a-zA-Z0-9#]+\/?)*$/,
        "Please enter a valid URL",
      ],
    },
    phone: {
      type: String,
      maxLength: [20, "Phone number cannot be longer than 20 characters"],
    },
    email: {
      type: String,
      match: [
        /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/,
        "Please enter valid email address",
      ],
    },
    address: {
      type: String,
      required: [true, "Please add an address"],
    },
    location: {
      // GeoJSON point
      type: {
        type: String,
        enum: ["Point"],
        required: false,
      },
      coordinates: {
        type: [Number],
        required: false,
        index: "2dsphere",
      },
      formattedAddress: String,
      street: String,
      city: String,
      state: String,
      zipcode: String,
      country: String,
    },
    careers: {
      // Array of strings
      type: [String],
      required: true,
      enum: [
        "Web Development",
        "Mobile Development",
        "UI/UX",
        "Data Science",
        "Business",
        "Other",
      ],
    },
    averageRating: {
      type: Number,
      min: [1, "Rating must be at least 1"],
      max: [10, "Rating cannot be higher than 10"],
    },
    averageCost: Number,
    photo: {
      type: String,
      default: "no-photo.jpg",
    },
    housing: {
      type: Boolean,
      default: false,
    },
    jobAssistance: {
      type: Boolean,
      default: false,
    },
    jobGuarantee: {
      type: Boolean,
      default: false,
    },
    acceptGovFund: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Create Bootcamp slug from bootcamp.name
BootcampSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });

  next();
});

// Geocode and create location field of object
BootcampSchema.pre("save", async function (next) {
  const location = await geocoder.geocode(this.address);

  this.location = {
    type: "Point",
    coordinates: [location[0].longitude, location[0].latitude],
    formattedAddress: location[0].formattedAddress,
    street: location[0].streetName,
    city: location[0].city,
    state: location[0].stateCode,
    zipcode: location[0].zipcode,
    country: location[0].countryCode,
  };

  // Do not save address in DB
  this.address = undefined;

  next();
});

// Cascade delete courses when a bootcamp is deleted
BootcampSchema.pre("remove", async function (next) {
  console.log(`Courses being removed from Bootcamp: ${this._id}, ${this.name}`);
  await this.model("Course").deleteMany({
    bootcamp: this._id, // Delete all courses that have this bootcampId field
  });
  next();
});

// Reverse populate() with virtuals
BootcampSchema.virtual("courses", {
  ref: "Course",
  localField: "_id", // Course id
  foreignField: "bootcamp",
  justOne: false,
});

module.exports = mongoose.model("Bootcamp", BootcampSchema);
