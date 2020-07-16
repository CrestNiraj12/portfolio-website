const router = require("express").Router();
const Post = require("../models/post.model");
const User = require("../models/user.model");

router.get("/dashboard", (req, res) => res.json("In dashboard"));

router.get("/:id", (req, res) => {
  User.findById(req.params.id).then((user) => req.json(user));
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
