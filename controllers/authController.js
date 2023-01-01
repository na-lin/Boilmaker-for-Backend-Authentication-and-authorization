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

// @desc: Create new user
// @route: POST /api/users/signup
// @access: Private
const login = asyncHandler(async (req, res, next) => {
  // 1. read email , password from req.body
  const { email, password } = req.body;
  // 2. check if email, password exist
  if (!email || !password) {
    res.status(400); // bad request
    throw new Error("Please provide email and password!");
  }
  // 3. fing user by email
  const user = await User.findOne({
    where: {
      email,
    },
  });
  // 4. Check if user exists && password is correct
  if (!user || !(await user.correctPassword(password))) {
    res.status(401);
    throw new Error("Incorrect email or password");
  }

  // 5. if everything is ok, return token & user info
  const token = user.generateToken();
  user.excludePasswordField();
  res.status(200).json({
    status: "success",
    token,
    user,
  });
});

module.exports = {
  signup,
  login,
};
