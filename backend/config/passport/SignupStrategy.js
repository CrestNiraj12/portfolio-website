const User = require("../../models/user.model");
const LocalStrategy = require("passport-local").Strategy;
const generateLink = require("../utils/linkGenerator");
const { sendActivationMail } = require("../utils/mailSender");
const crypto = require("crypto");

const SignupStrategy = new LocalStrategy(
  { passReqToCallback: true, usernameField: "email" },
  (req, email, password, done) => {
    User.findOne({ email }, (err, user) => {
      if (err) return done(err, null);
      if (user && user.active) return done("User already exists!", null);
      if (user && !user.active && !user.registrationExpired)
        return done(
          "User already registered! Please confirm your email address!",
          null
        );

      if (!user) {
        const newUser = new User({
          fullname: req.body.fullname,
          email,
          password,
          role: req.body.role,
        });

        crypto.randomBytes(20, (err, buf) => {
          if (err) return done(err, null);

          newUser.activeToken = newUser._id + buf.toString("hex");
          newUser.activeExpires = Date.now() + 24 * 60 * 60 * 1000;
          newUser.registrationExpired = false;

          sendSignupActivationMail(req, email, newUser.activeToken);

          newUser.save((err, data) => {
            if (err) return done(err, null);
            return done(null, data);
          });
        });
      } else {
        user.fullname = req.body.fullname;
        user.password = password;
        user.role = req.body.role;

        crypto.randomBytes(20, (err, buf) => {
          if (err) return done(err, null);

          user.activeToken = user._id + buf.toString("hex");
          user.activeExpires = Date.now() + 24 * 60 * 60 * 1000;
          user.registrationExpired = false;

          sendSignupActivationMail(req, email, user.activeToken);

          user.save((err, data) => {
            if (err) return done(err, null);
            return done(null, data);
          });
        });
      }
    });
  }
);

const sendSignupActivationMail = (req, email, token) => {
  const link = generateLink(req, "/user/confirm/", token);
  sendActivationMail(email, req.body.fullname, req.body.role, link);
};

module.exports = SignupStrategy;
