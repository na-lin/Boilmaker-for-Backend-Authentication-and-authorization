const db = require("./database");
const User = require("./models/userModel");
const Product = require("./models/productMode");
const users = require("./data/users");
const products = require("./data/products");
const seed = async () => {
  try {
    await db.sync({ force: true });
    console.log("db synced");

    await Promise.all(
      users.map((data) => {
        return User.create(data);
      })
    );
    await Promise.all(
      products.map((data) => {
        return Product.create(data);
      })
    );
    console.log("Seeding success!");
    db.close();
  } catch (err) {
    console.error("Oh noes! Something went wrong!");
    console.error(err);
    db.close();
  }
};

seed();
