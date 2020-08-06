const router = require("express").Router();
const mongoose = require("mongoose");
const Post = require("../models/post.model");
const User = require("../models/user.model");
const { validAuth, postUpload } = require("../config/middleware");

router.get("/", (req, res) => {
  Post.find()
    .populate("authorId")
    .exec((err, posts) => {
      if (err) return res.status(400).json("Error: " + err);
      return res.json(posts);
    });
});

router.get("/:id", (req, res) => {
  Post.findById(req.params.id)
    .populate("authorId")
    .exec((err, post) => {
      if (err) res.status(400).json("Error: " + err);
      return res.json(post);
    });
});

router.delete("/:userId/:id", validAuth, (req, res) => {
  Post.findByIdAndDelete(req.params.id)
    .then(() => {
      if (req.params.userId !== "404" || req.params.userId === null)
        User.findByIdAndUpdate(
          req.params.userId,
          { $pull: { posts: mongoose.mongo.ObjectId(req.params.id) } },
          { safe: true, upsert: true },
          (err, obj) => {
            if (err) console.log(err);
          }
        );
      return res.json("Post deleted!");
    })
    .catch((err) => res.status(400).json("Cant find post!"));
});

router.put("/update/:id", validAuth, postUpload, (req, res) => {
  Post.findById(req.params.id).then((post) => {
    post.title = req.body.title;
    post.description = req.body.description;
    if (req.file) post.thumbnail = req.file.filename;
    post.content = req.body.content;

    post
      .save()
      .then(() => res.json("Post Updated Successfully!"))
      .catch((err) => res.status(400).json(err));
  });
});

router.put("/selected", validAuth, (req, res) => {
  const postsId = req.body.dict;

  Post.deleteMany({ _id: { $in: Object.keys(postsId) } }, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(400).json("Error while deleting!");
    }

    const authorsId = [...new Set(Object.values(postsId))];
    User.find({ _id: { $in: authorsId } }, (err, users) => {
      if (users && users.length > 0) {
        users.forEach((user) => {
          user.posts = user.posts.filter(
            (postId) => !Object.keys(postsId).includes(String(postId))
          );
          user
            .save()
            .then(() =>
              console.log("sucessfully removed post id from author's posts!")
            )
            .catch((err) => console.log(err));
        });
      }
    });
    return res.json("Posts deleted successfully!");
  });
});

router.post("/images/upload", postUpload, (req, res) => {
  if (req.file) {
    filename = req.file.filename;
    console.log("Image uploaded, filename: " + filename);
    return res.json({ location: `/images/posts/${req.file.filename}` });
  } else {
    return res.status(400).json("Image upload failed!");
  }
});

module.exports = router;
