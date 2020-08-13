const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const passport = require("./backend/config/passport");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const helmet = require("helmet");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

const postsRouter = require("./backend/routes/posts");
const usersRouter = require("./backend/routes/users");
const authenticationRouter = require("./backend/routes/authentication");

app.use(cors());
app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + "/client/public"));

const url = process.env.COSMOS_URL;

mongoose
  .connect(url, {
    auth: {
      user: process.env.COSMOS_USER,
      password: process.env.COSMOS_PASS,
    },
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .catch((err) => console.log(err));

const connection = mongoose.connection;

const sessionStore = {
  name: "authSession",
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { httpOnly: true },
  store: new MongoStore({
    mongooseConnection: connection,
    secret: process.env.STORE_SECRET,
  }),
};

if (app.get("env") === "production") {
  const hour = 24 * 60 * 60 * 1000;
  app.set("trust proxy", 1);
  sessionStore.cookie.secure = true;
  sessionStore.cookie.maxAge = hour;
  sessionStore.cookie.expires = new Date(Date.now() + hour);
}

app.use(session(sessionStore));
app.use(passport.initialize());
app.use(passport.session());

app.use("/posts", postsRouter);
app.use("/user", usersRouter);
app.use("/auth", authenticationRouter);

connection
  .once("open", () => {
    console.log("Established database connection!");
  })
  .catch((err) => console.log(err));

if (process.env.NODE_ENV === "production") {
  const path = require("path");
  app.use(express.static(path.join(__dirname, "client/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve("client/build/index.html"));
  });
}

app.listen(port, () => console.log("Server running on port: " + port));
