const ErrorResponse = require("../utils/ErrorResponse");
const asyncHandler = require("../middleware/asyncHandler");
const User = require("../models/User");

// @description     Register User
// @route           POST /api/v1/auth/register
// @access          Public
exports.registerUser = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  // Create User
  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  // Create JWT Token
  const token = user.getSignedJwtToken();

  res.status(200).json({
    success: true,
    token: token,
  });
});
