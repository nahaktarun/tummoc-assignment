const bcrypt = require("bcrypt");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const User = require("../models/user-model");
const { SALT, jwtSecret, jwtExpiration } = require("../config/serverConfig");
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

const login = (req, res, next) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err) {
      return res.status(500).json({ message: "An error occurred", error: err });
    }

    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    req.login(user, { session: false }, (err) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "An error occurred", error: err });
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: user._id, username: user.username },
        jwtSecret,
        {
          expiresIn: jwtExpiration,
        }
      );

      return res.status(200).json({ token });
    });
  })(req, res, next);
};

const logout = (req, res) => {
  req.logout();
  res.status(200).json({ message: "Logged out successfully" });
};

const session = (req, res) => {
  res.status(200).json({ user: req.user });
};

module.exports = {
  signup,
  login,
  logout,
  session,
};
