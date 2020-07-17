const router = require("express").Router();
const Post = require("../models/post.model");
const User = require("../models/user.model");
const { pass } = require("../config/passport/LoginStrategy");

router.get("/all", (req, res) => {
  User.find()
    .then((users) => res.json(users))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.get("/:id/dashboard", (req, res) => res.json("In dashboard"));

router.put("/:id", (req, res) => {
  User.findById(req.params.id).then((user) => {
    user.fullname = req.body.fullname;
    const password = req.body.password;
    if (user.checkPassword(req.body.oldPassword)) {
      if (password === req.body.confirmPassword) {
        user.password = password;
      } else return res.status(400).json("New passwords do not match!");
    } else return res.status(400).json("Wrong password!");

    user
      .save()
      .then(() => res.json("User updated!"))
      .catch((err) => res.status(400).json("Error: " + err));
  });
});

router.get("/:id", (req, res) => {
  User.findById(req.params.id).then((user) => res.json(user));
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
