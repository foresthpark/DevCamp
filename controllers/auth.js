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

  sendTokenResponse(user, 200, res); // Token sending function
});

// @description     Login User
// @route           POST /api/v1/auth/login
// @access          Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate email and password
  if (!email || !password) {
    return next(new ErrorResponse("Please provide an email and password", 400));
  }

  // Check for user
  const user = await User.findOne({ email: email }).select("+password");

  if (!user) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }

  //Check if password matched
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }

  sendTokenResponse(user, 200, res); // Token sending function
});

// Get token from model, create cookie and send response
//
const sendTokenResponse = (user, statusCode, res) => {
  // Create JWT Token
  const token = user.getSignedJwtToken();

  // 30 days later
  // token will expire 30 days from now
  const thirtyDays =
    Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000;

  const options = {
    expires: new Date(thirtyDays),
    httpOnly: true,
  };

  // If in Production environment, cookies will be sent over https
  if (process.env.NODE_ENV === "production") {
    options.secure = { secure: true };
  }

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token: token,
  });
};
