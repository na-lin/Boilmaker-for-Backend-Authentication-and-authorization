const db = require("./database");
const User = require("./models/userModel");
const users = require("./data/users");
const seed = async () => {
  try {
    await db.sync({ force: true });
    console.log("db synced");

    await Promise.all(
      users.map((data) => {
        return User.create(data);
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
