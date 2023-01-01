const asyncHandler = require("express-async-handler");
const { User } = require("../db");

const updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findByPk(req.params.id);

  const { password, passwordConfirm } = req.body;
  if (!password || !passwordConfirm) {
    res.status(400);
    throw new Error("Please provide password and password confirm.");
  }

  if (req.body.password !== req.body.passwordConfirm) {
    res.status(400);
    throw new Error("Password is not same");
  }

  user.password = req.body.password;
  await user.save();

  user.excludePasswordField();
  res.send(user);
});

module.exports = {
  updatePassword,
};
