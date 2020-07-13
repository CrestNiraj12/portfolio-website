const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

const postsRouter = require("./backend/routes/posts");

app.use(cors);
app.use(express.json());

const url = process.env.ATLAS_URL;

mongoose
  .connect(url, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .catch((err) => console.log(err));

const connection = mongoose.connection;

connection
  .once("open", () => {
    console.log("Established database connection!");
  })
  .catch((err) => console.log(err));

app.get("/", function (req, res) {
  res.set("Content-Type", "text/plain");
  res.send("hello");
});
app.use("/posts", postsRouter);

if (process.env.NODE_ENV === "production") {
  const path = require("path");
  app.use(express.static(path.join(__dirname, "build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve("build/index.html"));
  });
}

app.listen(port, () => console.log("Server running on port: " + port));
