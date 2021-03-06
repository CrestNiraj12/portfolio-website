const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
  image: {
    type: String,
    default: "https://api.adorable.io/avatars/285/abott@adorable.png",
  },
  active: {
    type: Boolean,
    default: false,
  },
  activeToken: String,
  activeExpires: Date,
  passwordChangeToken: String,
  passwordChangeTokenExpires: Date,
});

userSchema.methods = {
  hashPassword: (password) =>
    bcrypt.hashSync(password, bcrypt.genSaltSync(8), null),
  checkPassword: function (password) {
    if (password !== undefined)
      return bcrypt.compareSync(password, this.password);
  },
};

userSchema.pre("save", function (next) {
  if (!this.password) {
    console.log("=======NO PASSWORD PROVIDED=======");
    next();
  } else {
    if (!this.isModified("password")) return next();
    console.log("hashPassword in pre save");
    this.password = this.hashPassword(this.password);
    next();
  }
});

const User = mongoose.model("User", userSchema);
module.exports = User;
