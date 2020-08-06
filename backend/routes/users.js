const router = require("express").Router();
const Post = require("../models/post.model");
const User = require("../models/user.model");
const { validAuth, userUpload, postUpload } = require("../config/middleware");
const {
  body,
  checkSchema,
  check,
  validationResult,
} = require("express-validator");

router.get("/all", (req, res) => {
  User.find()
    .then((users) => {
      if (req.query.exclude === "true")
        return res.json(
          users.filter(
            (user) =>
              String(user._id) !== req.session.userId || user.active === false
          )
        );
      else return res.json(users);
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

router.put(
  "/",
  validAuth,
  [
    body("newPassword")
      .optional({ checkFalsy: true })
      .matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/)
      .withMessage(
        "Invalid password pattern! Your password must be atleast 8 characters long and must contain atleast 1 lowercase letter, 1 uppercase letter, and 1 digit"
      ),
    check("newPassword")
      .optional({ checkFalsy: true })
      .custom((value, { req, loc, path }) => {
        if (value && value !== "" && value !== req.body.confirmPassword)
          throw new Error("New passwords do not match!");
        else return value;
      }),
  ],
  userUpload,
  (req, res) => {
    User.findById(req.session.userId)
      .then((user) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json(errors.errors[0].msg);
        }

        user.fullname = req.body.fullname;

        if (req.query.changePassword === "true") {
          const prevPassword = req.body.password;
          const newPassword = req.body.newPassword;

          if (user.checkPassword(prevPassword)) {
            user.password = newPassword;
          } else return res.status(400).json("Wrong password!");
        }

        var filename;
        if (req.query.imageUpload === "true") {
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

router.get("/checkToken/:passwordChangeToken", (req, res) => {
  User.findOne(
    {
      passwordChangeToken: req.params.passwordChangeToken,
      passwordChangeTokenExpires: { $gt: Date.now() },
    },
    (err, user) => {
      if (err) {
        console.log(err);
        return res.status(400).json("Unexpected error occured!");
      }
      if (!user)
        return res
          .status(400)
          .json("Your password reset link has expired! Please try again!");
      console.log("Password change token valid!");
      return res.status(200);
    }
  );
});

router.put(
  "/changePassword/:passwordChangeToken",
  [
    body("newPassword")
      .matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/)
      .withMessage(
        "Invalid password pattern! Your password must be atleast 8 characters long and must contain atleast 1 lowercase letter, 1 uppercase letter, and 1 digit"
      ),
    check("newPassword", "invalid password").custom(
      (value, { req, loc, path }) => {
        if (value !== req.body.confirmPassword)
          throw new Error("New passwords do not match!");
        else return value;
      }
    ),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors);
      return res.status(400).json(errors.errors[0].msg);
    }
    User.findOne(
      {
        passwordChangeToken: req.params.passwordChangeToken,
        passwordChangeTokenExpires: { $gt: Date.now() },
      },
      (err, user) => {
        if (err) {
          console.log(err);
          return res.status(400).json("Unexpected error occured!");
        }
        if (!user)
          return res
            .status(400)
            .json("Your password reset link has expired! Please try again!");
        user.password = req.body.newPassword;

        user
          .save()
          .then(() => res.json("Password changed successfully"))
          .catch((err) => res.status(400).json("Error changing password!"));
      }
    );
  }
);

router.get("/:id", validAuth, (req, res) => {
  User.findById(req.params.id)
    .populate("posts")
    .exec((err, user) => {
      if (err) res.status(400).json("Error: " + err);
      return res.json(user);
    });
});

router.delete("/:id", validAuth, (req, res) => {
  User.findById(req.params.id).then((user) => {
    if (user.role === "admin")
      return res.status(400).json("Error: Cant remove admin!");
    else {
      User.findByIdAndDelete(req.params.id)
        .then(() => res.json("Account deleted!"))
        .catch((err) => res.status(400).json("Error: " + err));
    }
  });
});

router.post("/addpost", validAuth, postUpload, (req, res) => {
  const authorId = req.session.userId;
  const thumbnail = req.file.filename;
  const newPost = new Post({ ...req.body, thumbnail, authorId });

  newPost
    .save()
    .then(() => {
      User.findByIdAndUpdate(
        authorId,
        { $push: { posts: newPost._id } },
        { new: true },
        (err, user) => {
          if (err) return res.status(400).json(err);
          return res.json("Post Added Successfully!");
        }
      );
    })
    .catch((err) => {
      console.log(err);
      return res.status(400).json("Error saving post! Try again!");
    });
});

router.put(
  "/:userId/changeRole",
  validAuth,
  checkSchema({
    role: {
      in: ["body"],
      isIn: {
        options: [["admin", "editor", "tester"]],
        errorMessage: "Invalid role!",
      },
    },
  }),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.errors[0].msg);
    }

    User.findByIdAndUpdate(
      req.params.userId,
      { role: req.body.role },
      { new: true },
      (err, user) => {
        if (err) return res.status(400).json("Error: " + err);
        return res.json({ message: "Role changed successfully!", user });
      }
    );
  }
);

router.put("/selected", validAuth, (req, res) => {
  var usersId = req.body.dict;

  User.find({ _id: { $in: usersId } }).then((users) => {
    var triedDeletingAdmin = false;
    users.forEach(({ _id: id, role }) => {
      if (role === "admin") {
        triedDeletingAdmin = true;
      }
    });

    if (triedDeletingAdmin)
      return res.status(400).json("Error: Admin accounts cant be deleted!");

    User.deleteMany({ _id: { $in: usersId } }, (err, result) => {
      if (err) {
        console.log(err);
        return res.status(400).json("Error while deleting!");
      }
      return res.json("Users deleted successfully!");
    });
  });
});

router.get("/confirm/:activeToken", (req, res) => {
  User.findOne(
    { activeToken: req.params.activeToken, activeExpires: { $gt: Date.now() } },
    (err, user) => {
      if (err) {
        console.log(err);
        return res.status(400).json("Unexpected error occured!");
      }
      if (!user)
        return res
          .status(400)
          .json("Your activation link has expired! Please register again!");
      user.active = true;
      user
        .save()
        .then(() => res.json("Email confirmation sucess!"))
        .catch((e) => res.status(400).json("Error confirming email!"));
    }
  );
});

module.exports = router;
