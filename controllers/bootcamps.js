const ErrorResponse = require("../utils/ErrorResponse");
const asyncHandler = require("../middleware/asyncHandler");
const geocoder = require("../utils/GeoCoder");

const Bootcamp = require("../models/Bootcamp");

// @description     Get all bootcamps
// @route           GET /api/v1/bootcamps/
// @access          Public

exports.getBootcamps = asyncHandler(async (req, res, next) => {
  let query;

  // Copy of req.query
  const reqQuery = { ...req.query };

  // Fields to exclude
  const removeFields = ["select", "sort", "page", "limit"];

  // Loop over removeFields and delete them from reqQuery
  removeFields.forEach((param) => delete reqQuery[param]);
  // console.log(reqQuery);

  // Create query string
  let queryString = JSON.stringify(reqQuery);
  // console.log(queryString);

  // Create MongoDB operators ($gt, $gt, $lt etc)
  queryString = queryString.replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => {
    return `$${match}`;
  });

  // Finding resource
  query = Bootcamp.find(JSON.parse(queryString)).populate("courses");

  // Select Fields
  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    query = query.select(fields);
  }

  // Sort Fields
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Bootcamp.countDocuments();

  query = query.skip(startIndex).limit(limit);

  // Executing query
  const bootcamps = await query;

  // Pagination Result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    pagination,
    data: bootcamps,
  });
});

// @description     Get single bootcamps
// @route           GET /api/v1/bootcamps/:id
// @access          Public

exports.getBootcamp = asyncHandler(async (req, res, next) => {
  console.log(req.query);
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: bootcamp,
  });
});

// @description     Create new bootcamp
// @route           POST /api/v1/bootcamps
// @access          Private

exports.createBootcamp = asyncHandler(async (req, res, next) => {
  console.log(req.body);
  const bootcamp = await Bootcamp.create(req.body);
  console.log(bootcamp);

  res.status(201).json({
    success: true,
    data: bootcamp,
  });
});

// @description     Update existing bootcamps
// @route           PUT /api/v1/bootcamps/:id
// @access          Private

exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  console.log(req.params.id);
  console.log(req.body);
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    updatedData: bootcamp,
  });
});

// @description     Delete existing bootcamps
// @route           DELETE /api/v1/bootcamps/:id
// @access          Private

exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }

  bootcamp.remove();

  res.status(200).json({
    success: true,
    deletedData: bootcamp,
  });
});

// @description     Get bootcamps within radius
// @route           GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access          Private

exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  const numberZipcode = Number(zipcode);
  const numberDistance = Number(distance);

  // Get Lat/Long from geocoder
  const location = await geocoder.geocode(zipcode);
  const lat = location[0].latitude;
  const long = location[0].longitude;
  console.log(long, lat);

  // Calculate radius using radians
  // Divide distance by radius of Earth
  // Earth Radius = 6,378km
  const radius = numberDistance / 6378;

  const bootcamps = await Bootcamp.find({
    location: {
      $geoWithin: { $centerSphere: [[long, lat], radius] },
    },
  });

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps,
  });
});
