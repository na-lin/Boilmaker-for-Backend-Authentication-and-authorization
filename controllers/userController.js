const asyncHandler = require("express-async-handler");
const { User } = require("../db");

// @desc: Update user's password when user is logged in
// @route: PUT /api/users/updateMypassword
// @access: Private
const updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findByPk(req.user.id);

  const { currentPassword, newPassword, newPasswordConfirm } = req.body;

  // make sure oldpassword, new password, password confirm exist
  if (!currentPassword || !newPassword || !newPasswordConfirm) {
    res.status(400);
    throw new Error(
      "Please provide current password, new password and confirm password of new one."
    );
  }

  // check if current password is correct
  if (!(await user.correctPassword(currentPassword))) {
    res.status(401);
    throw new Error("Your current password is wrong");
  }

  // If everything is ok, update password
  user.password = newPassword;
  user.passwordConfirm = newPasswordConfirm;

  // before save, hash password, update passwordChangedAt
  await user.save();

  user.excludePasswordField();
  res.status(200).json({
    status: "success",
    token: user.generateToken(),
    user,
  });
});

// @desc: Update user's field exclude password when user is logged in
// @route: PUT /api/users/updateMe
// @access: Private
const updateMe = asyncHandler(async (req, res, next) => {
  // check if user try to update password in this route
  if (req.body.password || req.body.passwordConfirm) {
    res.status(400);
    throw new Error(
      "This route is not for password updates. Please use /updateMypassword."
    );
  }

  // filter out unwanted fields name that are not allowed to updated
  const filteredBody = {
    name: req.body.name || req.user.name,
    email: req.body.email || req.user.email,
  };

  const [updateCount, updatedUsers] = await User.update(filteredBody, {
    where: {
      id: req.user.id,
    },
    returning: true,
  });

  const updateCurrectUser = updatedUsers[0];
  updateCurrectUser.excludePasswordField();

  res.status(200).json({
    status: "success",
    data: {
      user: updateCurrectUser,
    },
  });
});

// @desc: Get all users, exclude user who had been delete (active = false)
// @route: GET /api/users/
// @access: Private  & admin
const getAllUsers = asyncHandler(async (req, res, next) => {
  const users = await User.findAll();

  users.forEach((user) => user.excludePasswordField());

  res.status(200).json({
    status: "success",
    results: users.length,
    data: {
      users,
    },
  });
});

module.exports = {
  updatePassword,
  updateMe,
  getAllUsers,
};
