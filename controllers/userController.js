const asyncHandler = require("express-async-handler");
const { User } = require("../db");

const updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findByPk(req.params.id);

  // make sure oldpassword, new password, password confirm exist
  const { oldPassword, newPassword, passwordConfirm } = req.body;
  if (!oldPassword || !newPassword || !passwordConfirm) {
    res.status(400);
    throw new Error(
      "Please provide privous password, new password and confirm password of new one."
    );
  }

  if (!(await user.correctPassword(oldPassword))) {
    res.status(401);
    throw new Error("Old password is incorrect. ");
  }

  if (req.body.newPassword !== req.body.passwordConfirm) {
    res.status(400);
    throw new Error("Password is not same");
  }

  user.password = req.body.newPassword;
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
