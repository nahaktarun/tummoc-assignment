const express = require("express");
const bodyParser = require("body-parser");
const dbConnect = require("./config/dbConfig");
const { PORT } = require("./config/serverConfig");

const app = express();

const setUpServer = () => {
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  app.listen(PORT, () => {
    console.log(`Server Started at ${PORT}`);
  });
};

setUpServer();
dbConnect();
