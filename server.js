const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const passport = require("./backend/config/passport");
const flash = require("connect-flash");
const cookieSession = require("cookie-session");
const multer = require("multer");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

const postsRouter = require("./backend/routes/posts");
const usersRouter = require("./backend/routes/users");
const authenticationRouter = require("./backend/routes/authentication");

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    name: "loginSession",
    keys: [process.env.SESSION_KEY1, process.env.SESSION_KEY2],
  })
);

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use("/posts", postsRouter);
app.use("/user", usersRouter);
app.use("/auth", authenticationRouter);

const url = process.env.ATLAS_URL;

mongoose
  .connect(url, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .catch((err) => console.log(err));

const connection = mongoose.connection;

connection
  .once("open", () => {
    console.log("Established database connection!");
  })
  .catch((err) => console.log(err));

if (process.env.NODE_ENV === "production") {
  const path = require("path");
  app.use(express.static(path.join(__dirname, "build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve("build/index.html"));
  });
}

app.listen(port, () => console.log("Server running on port: " + port));
