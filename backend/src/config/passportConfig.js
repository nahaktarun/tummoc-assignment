const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user-model");
const bcrypt = require("bcrypt");

const passportConfig = (passport) => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "username",
      },
      async (username, password, done) => {
        try {
          const user = await User.findOne({ username });

          if (!user) {
            return done(null, false, { message: "Incorrect username" });
          }

          const isPasswordValid = await bcrypt.compare(password, user.password);
          if (!isPasswordValid) {
            return done(null, false, { message: "Incorrect password" });
          }

          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  // Serialize and deserialize user
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
};

module.exports = passportConfig;
