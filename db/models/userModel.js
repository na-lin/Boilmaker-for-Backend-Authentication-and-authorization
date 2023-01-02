const db = require("../database");
const Sequelize = require("sequelize");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const AppError = require("../../utils/appError");

const User = db.define("user", {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  role: {
    type: Sequelize.ENUM("user", "admin"),
    defaultValue: "user",
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  passwordConfirm: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      confirmPassword(value) {
        if (value === this.password) return;
        throw new AppError("Passwords are not the same", 400);
      },
    },
  },
  passwordChangedAt: {
    type: Sequelize.DATE,
  },
  passwordResetToken: Sequelize.STRING,
  passwordResetTokenExpires: Sequelize.DATE,
  active: {
    type: Sequelize.BOOLEAN,
    defaultValue: true,
  },
});

// @desc: hash password only if password is modified
User.addHook("beforeSave", async (user) => {
  // check if modify the password field
  if (!user.changed("password")) return;

  // hash password
  user.password = await bcrypt.hash(user.password, 12);

  // clear passwordConfirm field
  // comment to make passwordConfirm validate correctly work
  // user.passwordConfirm = "";
});

// @desc: update passwordChangedAt when update password
User.addHook("beforeSave", (user) => {
  if (!user.changed("password") || user.isNewRecord) return;
  user.passwordChangedAt = Date.now() - 1000;
});

// @desc: before find user, exclude user that active = false;
User.addHook("beforeFind", function (options) {
  options.where = { ...options.where, active: true };
});

// @desc: exclude password, passwordConfirm field
User.prototype.excludePasswordField = function () {
  this.password = undefined;
  this.passwordConfirm = undefined;
  this.passwordResetToken = undefined;
  this.passwordResetTokenExpires = undefined;
  this.passwordChangedAt = undefined;
  return this;
};

// @desc: generate jwt token
User.prototype.generateToken = function () {
  return jwt.sign({ id: this.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

// @desc: check if user entered password === password in db
User.prototype.correctPassword = async function (candidatePwd) {
  return await bcrypt.compare(candidatePwd, this.password);
};

// @desc: find user by token, if user don't exist, or token is invalid, throw error
User.verfiyToken = async function (token) {
  try {
    const decode = await jwt.verify(token, process.env.JWT_SECRET);
    return decode;
  } catch (err) {
    throw new AppError("Invalid Token, Please try to login in again.", 401);
  }
};

// @desc: check if token was issued after password changed
User.prototype.changedPasswordAfter = function (jwtTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return jwtTimestamp < changedTimestamp;
  }
  return false;
};

// @desc: generate reset token
User.prototype.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetTokenExpires = Date.now() + 60 * 60 * 1000;

  // return plain resetToken to send to user's email
  return resetToken;
};

module.exports = User;
