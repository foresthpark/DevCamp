const ErrorResponse = require("../utils/ErrorResponse");
const asyncHandler = require("../middleware/asyncHandler");

const Bootcamp = require("../models/Bootcamp");

// @description     Get all bootcamps
// @route           GET /api/v1/bootcamps/
// @access          Public

exports.getBootcamps = asyncHandler(async (req, res, next) => {
  try {
    const bootcamps = await Bootcamp.find();

    res.status(200).json({
      success: true,
      count: bootcamps.length,
      data: bootcamps,
    });
  } catch (err) {
    next(err);
  }
});

// @description     Get single bootcamps
// @route           GET /api/v1/bootcamps/:id
// @access          Public

exports.getBootcamp = asyncHandler(async (req, res, next) => {
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
    data: bootcamp,
  });
});

// @description     Delete existing bootcamps
// @route           DELETE /api/v1/bootcamps/:id
// @access          Private

exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);

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
