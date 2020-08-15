const router = require("express").Router();
const passport = require("../config/passport");
const { body, validationResult } = require("express-validator");
const generateLink = require("../config/utils/linkGenerator");
const {
  sendResetMail,
  sendActivationMail,
} = require("../config/utils/mailSender");
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
      const link = generateLink(
        req,
        "/password/recover/token/",
        user.passwordChangeToken
      );
      sendResetMail(email, link);

      user
        .save()
        .then(() =>
          res.json(
            "Link to reset password has been sent to your email! It can take upto 10 mins, please be patient."
          )
        )
        .catch((e) => {
          console.log(e);
          return res.status(400).json("Unexpected error occurred!");
        });
    });
  });
});

router.get("/resendLink/activation/:userId", (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      const link = generateLink(req, "/user/confirm/", user.activeToken);

      sendActivationMail(user.email, user.fullname, user.role, link);
      return res.json("Activation link sent successfully!");
    })
    .catch((err) => {
      console.log(err);
      return res.status(400).json("User not found!");
    });
});

const authenticate = (auth, req, res, next) => {
  passport.authenticate(auth, (err, user) => {
    if (err) {
      return err.status
        ? res.status(err.status).json({ message: err.message, id: err.id })
        : res.status(400).json(err);
    }

    req.login(user, (err) => {
      if (err) return res.status(401).json("Authentication error!");
      isAuthenticated = true;
      req.session.userId = user._id;

      return res.json({
        message: `${
          auth === "register"
            ? "Registration successful! Please confirm your email sent to your email address! It can take upto 10 mins, please be patient."
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
