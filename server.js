const dotenv = require("dotenv");
dotenv.config();

const app = require("./app");

app.listen(3010, () => {
  console.log("listen to port: 3010");
});
