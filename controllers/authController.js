const asyncHandler = require("express-async-handler");
const { User } = require("../db");

// @desc: Create new user
// @route: POST /api/users/signup
// @access: Private
const signup = asyncHandler(async (req, res, next) => {
  // 1. create user
  const { name, email, password, passwordConfirm } = req.body;

  // check if user with this email already exist
  const existUser = await User.findOne({ where: { email } });
  if (existUser) {
    res.status(401);
    throw new Error("User already exists.");
  }

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

// @desc: Login user
// @route: POST /api/users/login
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

// @desc: Check user is login before accessing private resources
// @route: -
// @access: Private
const protect = asyncHandler(async (req, res, next) => {
  //  1) get token from header, check token is exist inside req.headers
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    res.status(401);
    throw new Error("You are not logged in! Please log in to get access.");
  }
  //  2) valification token, check if token is valid , auto throw error when verify is wrong
  const decode = await User.verfiyToken(token);
  //  3) find user by decode token , get the id to find user
  const currentUser = await User.findByPk(decode.id);
  //  4) check if user still exists
  if (!currentUser) {
    res.status(401);
    throw new Error("The user belonging to this token does no longer exist.");
  }

  //  5) Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter()) {
    res.status(401);
    throw new Error("User recently changed password! Please log in again");
  }

  //  6) Grant access to protected Route
  req.user = currentUser;
  next();
});

module.exports = {
  signup,
  login,
  protect,
};
