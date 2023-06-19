const express = require("express");
const { PORT } = require("./config/serverConfig");

const app = express();

const setUpServer = () => {
  app.listen(PORT, () => {
    console.log(`Server Started at ${PORT}`);
  });
};

setUpServer();
