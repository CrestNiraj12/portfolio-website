const router = require("express").Router();
const passport = require("../config/passport");
const { body, validationResult } = require("express-validator");
const mailer = require("../config/utils/mailer");
const crypto = require("crypto");
const User = require("../models/user.model");

router.post(
  "/register",
  [
    body("email")
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage("Invalid Email Address!"),
    body("password")
      .matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/)
      .withMessage(
        "Invalid password pattern! Your password must be atleast 8 characters long and must contain atleast 1 lowercase letter, 1 uppercase letter, and 1 digit"
      ),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.errors[0].msg);
    }
    authenticate("register", req, res, next);
  }
);

router.post(
  "/login",
  [
    body("email")
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage("Invalid Email Address!"),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.errors[0].msg);
    }
    authenticate("login", req, res, next);
  }
);

router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
      return res.status(400).json("Error while logout!");
    }
    req.logout();
    return res.json("User logged out successfully!");
  });
});

router.post("/recoverPassword", (req, res) => {
  const email = req.body.email;

  User.findOne({ email }, (err, user) => {
    if (err) return res.status(400).json("No user found!");

    crypto.randomBytes(20, (err, buf) => {
      user.passwordChangeToken = user._id + buf.toString("hex");
      user.passwordChangeTokenExpires = Date.now() + 3600 * 1000;
      const port = process.env.PORT || 3000;

      const link =
        req.protocol +
        "://" +
        (process.env.NODE_ENV === "production"
          ? req.get("host")
          : "localhost") +
        (port === 80 || port === 443 ? "" : ":" + port) +
        "/password/recover/user/" +
        user._id +
        "/token/" +
        user.passwordChangeToken;

      mailer({
        to: email,
        subject: "Confirm password change",
        html:
          `<h2>Password Reset Request</h2><p>Please click on the following link to reset your password.</p><a href="` +
          link +
          `">${link}</a><p>This token is only valid for 1 hour.</p>
            <p>If it wasn't you or if you have any questions, please reply this email.</p><p>Regards,</p><p>Admin at <a href="nirajshrestha.tech">nirajshrestha.tech</a></p>`,
      });

      user
        .save()
        .then(() =>
          res.json("Link to reset password has been sent to your email!")
        )
        .catch((e) => {
          console.log(e);
          return res.status(400).json("Unexpected error occurred!");
        });
    });
  });
});

const authenticate = (auth, req, res, next) => {
  passport.authenticate(auth, (err, user) => {
    if (err) return res.status(400).json(err);
    req.login(user, (err) => {
      if (err) return res.status(401).json("Authentication error!");
      isAuthenticated = true;
      req.session.userId = user._id;

      return res.json({
        message: `${
          auth === "register"
            ? "Registration successful! Please confirm your email sent to your email address!"
            : "User logged in"
        }!`,
        user: {
          id: user.id,
          email: user.email,
        },
      });
    });
    req.password = user.password;
  })(req, res, next);
};

module.exports = router;
