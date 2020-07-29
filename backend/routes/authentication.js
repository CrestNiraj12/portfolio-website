const router = require("express").Router();
const passport = require("../config/passport");
const { body, validationResult } = require("express-validator");

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

const authenticate = (auth, req, res, next) => {
  passport.authenticate(auth, (err, user) => {
    if (err) return res.status(400).json(err);
    req.login(user, (err) => {
      if (err) return res.status(401).json("Authentication error!");
      isAuthenticated = true;
      req.session.userId = user._id;

      return res.json({
        message: `User ${auth === "register" ? "registered" : "logged in"}!`,
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
