const Jimp = require("jimp");
const fs = require("fs");
const path = require("path");
const imagemin = require("imagemin");
const imageminMozJpeg = require("imagemin-mozjpeg");
const imageminPngquant = require("imagemin-pngquant");

const defaultPath = "client/build/static/media";

exports.optimizeImage = (filePath, dest, build = false, maxWidth = null) => {
  imagemin([filePath], {
    cache: false,
    destination: dest,
    plugins: [
      imageminMozJpeg(),
      imageminPngquant({
        quality: [0.6, 0.8],
      }),
    ],
  })
    .then(() => {
      if (build) filterFilesAndResize(dest);
      else resizeFile(filePath, maxWidth ? maxWidth : null);
    })
    .catch((err) => console.log(err));
};

const filterFilesAndResize = (dirPath) => {
  fs.readdirSync(dirPath)
    .filter((f) =>
      ["png", "jpg", "jpeg"].includes(f.split(".").pop().toLowerCase())
    )
    .forEach((file) => {
      resizeFile(path.join(dirPath, file), null);
    });
};

const resizeFile = (fullPath, maxWidth) => {
  defaultWidth = maxWidth ? maxWidth : 800;

  Jimp.read(fullPath)
    .then((image) => {
      return image.contain(defaultWidth, Jimp.AUTO).write(fullPath);
    })
    .catch((err) => {
      console.log(fullPath);
      console.log(err);
    });
};

this.optimizeImage(`${defaultPath}/*.{jpg,png,jpeg}`, defaultPath, true);
