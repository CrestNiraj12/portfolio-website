const User = require("../../models/user.model");
const LocalStrategy = require("passport-local").Strategy;

const LoginStrategy = new LocalStrategy(
  { usernameField: "email" },
  (email, password, done) => {
    User.findOne({ email }, (err, user) => {
      if (err) return done(err, null);
      if (!user) return done("No user found!", false);
      if (!user.checkPassword(password))
        return done("Username or Password do not match!", false);
      if (!user.active)
        return done(
          {
            message: "Please confirm your email first!",
            status: 403,
            id: user._id,
          },
          false
        );
      return done(null, user);
    });
  }
);

module.exports = LoginStrategy;
