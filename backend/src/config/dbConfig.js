const mongoose = require("mongoose");
const { MONGODB_URI } = require("./serverConfig");
const dbConnect = () => {
  mongoose
    .connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log(err));
};

module.exports = dbConnect;
