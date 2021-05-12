const multer = require("multer");
require("dotenv").config();

const path =
  process.env.NODE_ENV === "production"
    ? "./client/build/images"
    : "./client/public/images/";

var config = {
  destination: path,
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now() + ".jpg");
  },
};

const userStorage = multer.diskStorage({
  ...config,
  destination: path + "/users",
});
const postStorage = multer.diskStorage({
  ...config,
  destination: path + "/posts",
});

exports.postUpload = multer({
  storage: postStorage,
}).single("image");

exports.userUpload = multer({
  storage: userStorage,
}).single("image");

exports.validAuth = (req, res, next) => {
  if (req.isAuthenticated()) next();
  else return res.status(401).json("User not authenticated!");
};
