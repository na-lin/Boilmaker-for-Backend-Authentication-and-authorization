const asyncHandler = require("express-async-handler");
const { User } = require("../db");
const AppError = require("../utils/appError");
// @desc: Update user's password when user is logged in
// @route: PUT /api/users/updateMypassword
// @access: Private
const updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findByPk(req.user.id);

  const { currentPassword, newPassword, newPasswordConfirm } = req.body;

  // make sure oldpassword, new password, password confirm exist
  if (!currentPassword || !newPassword || !newPasswordConfirm) {
    throw new AppError(
      "Please provide current password, new password and confirm password of new one.",
      400
    );
  }

  // check if current password is correct
  if (!(await user.correctPassword(currentPassword))) {
    throw new AppError("Your current password is wrong", 401);
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
    data: {
      user,
    },
  });
});

// @desc: Update user's field exclude password when user is logged in
// @route: PUT /api/users/updateMe
// @access: Private
const updateMe = asyncHandler(async (req, res, next) => {
  // check if user try to update password in this route
  if (req.body.password || req.body.passwordConfirm) {
    throw new AppError(
      "This route is not for password updates. Please use /updateMypassword.",
      400
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

// @desc: delete user by set user active = false;
// @route: DELETE /api/users/deleteMe
// @access: Private
const deleteMe = asyncHandler(async (req, res, next) => {
  await User.update(
    { active: false },
    {
      where: {
        id: req.user.id,
      },
    }
  );
  res.status(204).json({
    status: "success",
    data: null,
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

// @desc: Test for check beforeFind hook work correctly
// @route: GET /api/users/test
// @access: public
// @more: poppy@example is the user who active = false.
const testForFilter = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ where: { email: "poppy@example.com" } });
  res.json({
    status: "success",
    message: "poppy@example.com is inactive in seed data",
    data: { user },
  });
});

module.exports = {
  updatePassword,
  updateMe,
  deleteMe,
  getAllUsers,
  testForFilter,
};
