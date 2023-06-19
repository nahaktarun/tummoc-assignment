const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");
const session = require("express-session");
const dbConnect = require("./config/dbConfig");
const { PORT, jwtSecret } = require("./config/serverConfig");
const { authRoutes } = require("./routes");
const app = express();

const setUpServer = () => {
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(
    session({
      secret: jwtSecret,
      resave: false,
      saveUninitialized: false,
    })
  );

  // Initialize passport
  app.use(passport.initialize());
  app.use(passport.session());

  app.listen(PORT, () => {
    console.log(`Server Started at ${PORT}`);
  });
};

setUpServer();
dbConnect();

// Routes
app.use("/api/auth", authRoutes);

// Initialize passport
