module.exports = {
  validAuth: (req, res, next) => {
    if (req.isAuthenticated()) next();
    else return res.status(401).json("User not authenticated!");
  },
};
