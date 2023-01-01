const dotenv = require("dotenv");
dotenv.config();
const db = require("./db/database");
const app = require("./app");

db.sync()
  .then(() => {
    console.log("db connected");
  })
  .catch((err) => {
    console.log("db connect fail");
    console.log(err);
  });
app.listen(3010, () => {
  console.log("listen to port: 3010");
});
