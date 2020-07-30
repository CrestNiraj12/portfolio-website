const User = require("../../models/user.model");
const LocalStrategy = require("passport-local").Strategy;
const mailer = require("../utils/mailer");
const crypto = require("crypto");

const SignupStrategy = new LocalStrategy(
  { passReqToCallback: true, usernameField: "email" },
  function (req, email, password, done) {
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

        const link =
          req.protocol +
          "://" +
          (process.env.NODE_ENV === "production"
            ? req.get("host")
            : "localhost") +
          (port === 80 || port === 443 ? "" : ":" + port) +
          "/user/confirm/" +
          newUser.activeToken;

        mailer({
          to: req.body.email,
          subject: "Confirm your email address",
          html:
            `<h2>Hello, ${req.body.fullname}!</h2><h3>My new ${req.body.role}!</h3><p>Please click on the following link to activate your account.</p><a href="` +
            link +
            `">${link}</a><p>This token is only valid for 24 hours. After that, you need to re-register your account!</p>
            <p>If you have any questions, please reply this email.</p><p>Regards,</p><p>Admin at <a href="nirajshrestha.tech">nirajshrestha.tech</a></p>`,
        });

        newUser.save((err, data) => {
          if (err) return done(err, null);
          return done(null, data);
        });
      });
    });
  }
);

module.exports = SignupStrategy;
