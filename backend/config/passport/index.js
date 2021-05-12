const passport = require("passport");
const SignupStrategy = require("./SignupStrategy");
const LoginStrategy = require("./LoginStrategy");
const User = require("../../models/user.model");

passport.use("register", SignupStrategy);
passport.use("login", LoginStrategy);

passport.serializeUser((user, done) => {
  done(null, user.email);
});

passport.deserializeUser((email, done) => {
  User.findOne({ email }, (err, user) => {
    done(err, user);
  });
});

module.exports = passport;
