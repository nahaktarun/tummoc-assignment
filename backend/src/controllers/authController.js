const bcrypt = require("bcrypt");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const User = require("../models/user-model");
const { SALT, jwtSecret, jwtExpiration } = require("../config/serverConfig");

const signup = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const newUser = new User({
      username,
      email,
      password,
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newUser.password, salt);
    newUser.password = hashedPassword;

    // Save user to the database
    await newUser.save();

    return res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Error creating user", error: err });
  }
};

const login = async (req, res, next) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err) {
      console.log(err);
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
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
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
