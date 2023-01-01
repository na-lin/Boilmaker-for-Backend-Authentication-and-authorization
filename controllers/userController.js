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

module.exports = {
  updatePassword,
};
