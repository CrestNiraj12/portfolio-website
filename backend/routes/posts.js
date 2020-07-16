const router = require("express").Router();
const Post = require("../models/post.model");

router.get("/", (req, res) => {
  Post.find()
    .then((posts) => res.json(posts))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.get("/:title", (req, res) => {
  const id = req.params.title.split("-").pop();
  Post.findById(id)
    .then((post) => res.json(post))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.delete("/:id", (req, res) => {
  Post.findByIdAndDelete(req.params.id)
    .then(() => res.json("Post Deleted!"))
    .catch((err) => res.status(400).json("Error: " + err));
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
