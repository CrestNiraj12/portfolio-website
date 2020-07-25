const router = require("express").Router();
const Post = require("../models/post.model");
const User = require("../models/user.model");
const multer = require("multer");

router.get("/all", (req, res) => {
  User.find()
    .then((users) => res.json(users))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.get("/:id/all", (req, res) => {
  User.find()
    .then((users) =>
      res.json(users.filter((user) => String(user._id) !== req.params.id))
    )
    .catch((err) => res.status(400).json("Error: " + err));
});

const storage = multer.diskStorage({
  destination: "./client/public/images/",
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now() + ".jpg");
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => cb(null, true),
}).single("image");

router.put(
  "/:id/changePassword/:passChange/imageUpload/:imageUpload",
  upload,
  (req, res) => {
    User.findById(req.params.id)
      .then((user) => {
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
          } else {
            return res.status(400).json("Image upload failed!");
          }
        }

        user
          .save()
          .then(() => {
            return res.json({
              message: "User updated successfully!",
              filename,
            });
          })
          .catch((err) =>
            res.status(400).json("User couldnt be saved! Try again!")
          );
      })
      .catch((err) => res.status(400).json("Error finding user!"));
  }
);

router.get("/:id", (req, res) => {
  User.findById(req.params.id)
    .populate("posts")
    .exec((err, user) => {
      if (err) res.status(400).json("Error: " + err);
      return res.json(user);
    });
});

router.delete("/:id", (req, res) => {
  User.findById(req.params.id).then(({ role }) => {
    if (role === "admin")
      return res.status(400).json("Error: Cant remove admin!");
    else {
      User.findByIdAndDelete(req.params.id)
        .then(() => res.json("Account deleted!"))
        .catch((err) => res.status(400).json("Error: " + err));
    }
  });
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

router.put("/:userId/changeRole", (req, res) => {
  User.findByIdAndUpdate(
    req.params.userId,
    { role: req.body.role },
    (err, user) => {
      if (err) return res.status(400).json("Error: " + err);
      return res.json({ message: "Role changed successfully!", user });
    }
  );
});

router.put("/selected", (req, res) => {
  var usersId = req.body.dict;
  var triedDeletingAdmin = false;

  User.find({ _id: { $in: usersId } }).then((users) => {
    users.forEach(({ _id: id, role }) => {
      if (role === "admin") {
        usersId = usersId.filter((userId) => userId !== String(id));
        triedDeletingAdmin = true;
      }
    });
    if (usersId.length > 0)
      User.deleteMany({ _id: { $in: usersId } }, (err, result) => {
        if (err) {
          console.log(err);
          return res.status(400).json("Error while deleting!");
        }
        if (triedDeletingAdmin)
          return res.json("Cant delete admin! Deleted other users!");
        return res.json("Users deleted successfully!");
      });
    else return res.status(400).json("Error: Cant delete admin!");
  });
});

module.exports = router;
