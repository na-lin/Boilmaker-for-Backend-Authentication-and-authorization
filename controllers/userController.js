const asyncHandler = require("express-async-handler");
const { User } = require("../db");

const updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findByPk(req.params.id);

  if (req.body.password !== req.body.passwordConfirm) {
    res.status(400);
    throw new Error("Password is not same");
  }
  if (req.body.password) {
    user.password = req.body.password;
  }

  // save change to db
  await user.save();

  user.excludePasswordField();
  res.send(user);
});

module.exports = {
  updatePassword,
};
