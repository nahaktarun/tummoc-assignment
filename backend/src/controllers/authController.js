const bcrypt = require("bcrypt");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const User = require("../models/user-model");
const { SALT } = require("../config/serverConfig");
const signup = (req, res) => {
  const { username, password } = req.body;

  User.findOne({ username }).then((user) => {
    if (user) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const newUser = new User({
      username,
      password,
    });

    // Hash password
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err;
        newUser.password = hash;

        // Save user to the database
        newUser
          .save()
          .then(() =>
            res
              .status(201)
              .json({ message: "User created successfully", data: newUser })
          )
          .catch((err) =>
            res.status(500).json({ message: "Error creating user", error: err })
          );
      });
    });
  });
};

const login = (req, res, next) => {};

const logout = (req, res) => {};

const session = (req, res) => {};

module.exports = {
  signup,
  login,
  logout,
  session,
};
