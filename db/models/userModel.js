const db = require("../database");
const Sequelize = require("sequelize");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = db.define("user", {
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
        throw new Error("Passwords are not the same");
      },
    },
  },
});

// @desc: hash password only if password is modified
User.addHook("beforeSave", async (user) => {
  // check if modify the password field
  if (!user.changed("password")) return;

  // hash password
  user.password = await bcrypt.hash(user.password, 12);

  // clear passwordConfirm field
  user.passwordConfirm = "";
});

// @desc: exclude password, passwordConfirm field
User.prototype.excludePasswordField = function () {
  this.password = undefined;
  this.passwordConfirm = undefined;
  return this;
};

// @desc: check if passwordConfirm === password

module.exports = User;
