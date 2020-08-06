const User = require("../../models/user.model");
const LocalStrategy = require("passport-local").Strategy;
const mailer = require("../utils/mailer");
const generateLink = require("../utils/linkGenerator");
const { sendActivationMail } = require("../utils/mailSender");
const crypto = require("crypto");

const SignupStrategy = new LocalStrategy(
  { passReqToCallback: true, usernameField: "email" },
  (req, email, password, done) => {
    User.findOne({ email }, (err, user) => {
      if (err) return done(err, null);
      if (user) return done("User already exists!", null);

      const newUser = new User({
        fullname: req.body.fullname,
        email,
        password,
        role: req.body.role,
      });

      crypto.randomBytes(20, (err, buf) => {
        newUser.activeToken = newUser._id + buf.toString("hex");
        newUser.activeExpires = Date.now() + 24 * 60 * 60 * 1000;
        const port = process.env.PORT || 3000;

        const link = generateLink(req, "/user/confirm/", newUser.activeToken);

        sendActivationMail(email, req.body.fullname, req.body.role, link);

        newUser.save((err, data) => {
          if (err) return done(err, null);
          return done(null, data);
        });
      });
    });
  }
);

module.exports = SignupStrategy;
