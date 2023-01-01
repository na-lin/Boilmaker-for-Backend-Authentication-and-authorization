const asyncHandler = require("express-async-handler");
const { User } = require("../db");

// @desc: Create new user
// @route: POST /api/users/signup
// @access: Private
const signup = asyncHandler(async (req, res, next) => {
  // 1. create user
  const { name, email, password, passwordConfirm } = req.body;
  const newUser = await User.create({
    name,
    email,
    password,
    passwordConfirm,
  });
  // 2. create token
  const token = newUser.generateToken();

  newUser.excludePasswordField();

  // 3. send token back to client
  res.status(201).json({
    status: "success",
    token,
    newUser,
  });
});

module.exports = {
  signup,
};
