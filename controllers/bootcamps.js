// @description     Get all bootcamps
// @route           GET /api/v1/bootcamps/
// @access          Public

exports.getBootcamps = (req, res) => {
  res.status(200).json({
    success: true,
    message: "Show all bootcamps",
  });
};

// @description     Get single bootcamps
// @route           GET /api/v1/bootcamps/:id
// @access          Public

exports.getBootcamp = (req, res) => {
  res.status(200).json({
    success: true,
    message: `Display specific bootcamp ID: ${req.params.id}`,
  });
};

// @description     Create new bootcamps
// @route           POST /api/v1/bootcamps
// @access          Private

exports.createBootcamp = (req, res) => {
  res.status(200).json({
    success: true,
    message: "Create a new bootcamp",
  });
};

// @description     Update existing bootcamps
// @route           PUT /api/v1/bootcamps/:id
// @access          Private

exports.updateBootcamp = (req, res) => {
  res.status(200).json({
    success: true,
    message: `Update bootcamp ID: ${req.params.id}`,
  });
};

// @description     Delete existing bootcamps
// @route           DELETE /api/v1/bootcamps/:id
// @access          Private

exports.deleteBootcamp = (req, res) => {
  res.status(200).json({
    success: true,
    message: `Delete bootcamp ID: ${req.params.id}`,
  });
};
