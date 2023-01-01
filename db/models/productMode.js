const db = require("../database");
const Sequelize = require("sequelize");

const Product = db.define("product", {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  name: Sequelize.STRING,
  price: Sequelize.FLOAT,
  brand: Sequelize.STRING,
  category: Sequelize.STRING,
  countInStock: Sequelize.INTEGER,
});

module.exports = Product;
