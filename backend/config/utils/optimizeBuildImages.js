const { optimizeImage } = require("./optimizeImages");

const defaultPath = "client/build/static/media";
optimizeImage(`${defaultPath}/*.{jpg,png,jpeg}`, defaultPath, true);
