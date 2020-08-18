const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const passport = require("./backend/config/passport");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const helmet = require("helmet");
const path = require("path");

require("dotenv").config({
  path: `.env.${process.env.NODE_ENV.trim() || "development"}`,
});

const app = express();
const port = process.env.PORT || 5000;

const postsRouter = require("./backend/routes/posts");
const usersRouter = require("./backend/routes/users");
const authenticationRouter = require("./backend/routes/authentication");

app.use(cors());
app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  express.static(
    path.join(
      __dirname,
      process.env.NODE_ENV === "production" ? "/client/build" : "/client/public"
    )
  )
);

const url = process.env.CONNECTION_URL;

mongoose
  .connect(url, {
    auth: {
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
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
    ttl: 24 * 60 * 60 * 1000,
    autoRemove: "interval",
    autoRemoveInterval: 10,
  }),
};

if (process.env.NODE_ENV === "production") {
  const hour = 24 * 60 * 60 * 1000;
  app.set("trust proxy", 1);
  sessionStore.cookie.secure = true;
  sessionStore.cookie.maxAge = hour;
  sessionStore.cookie.expires = new Date(Date.now() + hour);
}

app.use(session(sessionStore));
app.use(passport.initialize());
app.use(passport.session());

if (process.env.NODE_ENV === "production")
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });

app.use("/posts", postsRouter);
app.use("/user", usersRouter);
app.use("/auth", authenticationRouter);

connection
  .once("open", () => {
    console.log("Established database connection!");
  })
  .catch((err) => console.log(err));

app.listen(port, () => console.log("Server running on port: " + port));
