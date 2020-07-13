const router = require("express").Router();
const Post = require("../models/post.model");

router.route("/").get((req, res) => {
  console.log("here");
  Post.find()
    .then((posts) => res.json(posts))
    .catch((err) => {
      res.status(400).json("Error: " + err);
    });
});

router.route("/add").post((req, res) => {
  console.log(req.body);
  const newPost = new Post(req.body);

  newPost
    .save()
    .then(() => res.json("Post Added!"))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/:title").get((req, res) => {
  const id = req.params.title.split("-").pop();
  Post.findById(id)
    .then((post) => res.json(post))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/:id").delete((req, res) => {
  Post.findByIdAndDelete(req.params.id)
    .then(() => res.json("Post Deleted!"))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/update/:id").post((req, res) => {
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
