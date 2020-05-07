const ErrorResponse = require("../utils/ErrorResponse");
const asyncHandler = require("../middleware/asyncHandler");
const geocoder = require("../utils/GeoCoder");
const path = require("path");
const Bootcamp = require("../models/Bootcamp");

// @description     Get all bootcamps
// @route           GET /api/v1/bootcamps/
// @access          Public

exports.getBootcamps = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
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

// @description     Upload photo for bootcamp
// @route           PUT /api/v1/bootcamps/:id/photo
// @access          Private

exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }

  if (!req.files) {
    return next(new ErrorResponse("Please upload a file", 400));
  }

  const file = req.files.file;

  // Validate image is photo
  if (!file.mimetype.startsWith("image")) {
    return next(new ErrorResponse("Please upload an IMAGE file", 400));
  }

  // Check file size
  if (file.size > process.env.MAX_FILE_SIZE) {
    return next(
      new ErrorResponse(
        `Image size is too large. Please upload an image less than ${process.env.MAX_FILE_SIZE}`,
        400
      )
    );
  }

  // Create custom file name
  file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

  // Upload file
  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse("Problem with file upload", 500));
    }

    await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });

    res.status(200).json({
      success: true,
      data: file.name,
    });
  });

  console.log(file.name);
});
