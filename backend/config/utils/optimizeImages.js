const sharp = require("sharp");
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
    .then((files) => {
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

  sharp(fullPath)
    .resize({ width: defaultWidth, fit: "contain" })
    .toBuffer()
    .then((buf) => {
      fs.writeFile(fullPath, buf, (e) => {
        if (e) console.log(e);
      });
    })
    .catch((err) => console.log(err));
};

this.optimizeImage(`${defaultPath}/*.{jpg,png,jpeg}`, defaultPath, true);
