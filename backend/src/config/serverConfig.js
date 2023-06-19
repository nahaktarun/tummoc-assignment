const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  PORT: process.env.PORT,
  MONGODB_URI: process.env.MONGODB_URI,
  SALT: process.env.SALT,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiration: "1h", //
};
