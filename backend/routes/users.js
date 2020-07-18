const router = require("express").Router();
const Post = require("../models/post.model");
const User = require("../models/user.model");
const path = require("path");
const multer = require("multer");

router.get("/all", (req, res) => {
  User.find()
    .then((users) => res.json(users))
    .catch((err) => res.status(400).json("Error: " + err));
});

const storage = multer.diskStorage({
  destination: "./client/public/images/",
  filename: (req, file, cb) => {
    console.log(req.body);
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const checkFileType = (file, cb) => {
  const filetypes = /jpeg|png|jpg|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) return cb(null, true);
  else return cb("Error: Images only!");
};

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
}).single("image");

router.put(
  "/:id/changePassword/:passChange/imageUpload/:imageUpload",
  (req, res) => {
    User.findById(req.params.id).then((user) => {
      upload(req, res, (err) => {
        if (err) return res.status(400).json(err);

        user.fullname = req.body.fullname;

        if (req.params.passChange === "true") {
          const prevPassword = req.body.password;
          const newPassword = req.body.newPassword;

          if (user.checkPassword(prevPassword)) {
            user.password = newPassword;
          } else return res.status(400).json("Wrong password!");
        }

        var filename;
        if (req.params.imageUpload === "true") {
          if (req.file) {
            filename = req.file.filename;
            user.image = filename;
            console.log(user);
          } else {
            return res.status(400).json("Image upload failed!");
          }
        }

        user
          .save()
          .then(() => {
            return res.json({ message: "User updated!", filename });
          })
          .catch((err) => res.status(400).json("Error: " + err));
      });
    });
  }
);

router.get("/:id", (req, res) => {
  User.findById(req.params.id)
    .populate("posts")
    .exec((err, user) => {
      if (err) res.status(400).json("Error: " + err);
      console.log(user);
      return res.json(user);
    });
});

router.delete("/:id", (req, res) => {
  User.findByIdAndDelete(req.params.id)
    .then(() => res.json("Account deleted!"))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.post("/:id/addpost", (req, res) => {
  const authorId = req.params.id;
  const newPost = new Post({ ...req.body, authorId });

  newPost.save();

  User.findByIdAndUpdate(
    authorId,
    { $push: { posts: newPost._id } },
    { new: true },
    (err, user) => {
      if (err) return res.status(400).json("Error: " + err);
      return res.json({ message: "Post Added to user profile!", user });
    }
  );
});

module.exports = router;
