const router = require("express").Router();
const passport = require("../config/passport");

router.post("/register", (req, res, next) => {
  authenticate("register", req, res, next);
});

router.post("/login", (req, res, next) => {
  authenticate("login", req, res, next);
});

router.get("/logout", (req, res) => {
  req.logout();
  return res.json("User logged out successfully!");
});

const authenticate = (auth, req, res, next) => {
  passport.authenticate(auth, (err, user) => {
    if (err) return res.status(400).json(err);
    req.logIn(user, (err) => {
      if (err) return res.status(400).json(err);
      isAuthenticated = true;
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
