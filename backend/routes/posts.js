const router = require("express").Router();
const mongoose = require("mongoose");
const Post = require("../models/post.model");
const User = require("../models/user.model");

router.get("/", (req, res) => {
  Post.find()
    .then((posts) => res.json(posts))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.get("/:title", (req, res) => {
  const id = req.params.title.split("-").pop();
  Post.findById(id)
    .populate("authorId")
    .exec((err, post) => {
      if (err) res.status(400).json("Error: " + err);
      return res.json(post);
    });
});

router.delete("/:userId/:id", (req, res) => {
  const messages = { message: [] };
  Post.findByIdAndDelete(req.params.id)
    .then(() => (messages.message = "Post Deleted!"))
    .catch((err) => res.status(400).json("Error: " + err));

  User.findByIdAndUpdate(
    req.params.userId,
    { $pull: { posts: mongoose.mongo.ObjectId(req.params.id) } },
    { safe: true, upsert: true },
    (err, obj) => {
      if (err)
        return res
          .status(400)
          .json("Messages: " + messages + "\nError: " + err);
      messages.prevObject = obj;
      return res.json(messages);
    }
  );
});

router.put("/update/:id", (req, res) => {
  Post.findById(req.params.id).then((post) => {
    post.title = req.body.title;
    post.description = req.body.description;
    post.thumbnail = req.body.thumbnail;
    post.content = req.body.content;
    post.images = req.body.images;

    post
      .save()
      .then(() => res.json("Post Updated!"))
      .catch((err) => res.status(400).json("Error: " + err));
  });
});

module.exports = router;
