[![Awesome Badges](https://img.shields.io/badge/badges-awesome-green.svg)](https://github.com/Naereen/badges)
[![ISC license](https://img.shields.io/badge/License-ISC-blue.svg)](https://www.isc.org/)

# Portfolio Website

My personal website and a personal project to challenge myself to build a website with ReactJS frontend while using Redux, Sass and NodeJS with Express for the backend after one
or two online courses.

- ⚡ Fun fact: I already have the same website made from scratch using only HTML, CSS and JS with JQuery 🤯 [HERE](https://github.com/CrestNiraj12/Final-Website-Assignment)

## Available Scripts

In the project directory, you can run:

### `npm start`

Sets NODE_ENV to production and runs the server to start responding for requests.

### `npm azure`

Sets NPM_CONFIG_PRODUCTION to false then,

- #### `npm install --prefix client`

  Installs client dependency packages

- #### `npm run build --prefix client`

  Runs the build script of client

- #### `node backend/config/utils/optimizeImages.js`

  Optimizes and Resizes images for better performance. Makes use of [imagemin](https://www.npmjs.com/package/imagemin) package that uses the following plugins to optimize:

  - [imagemin-pngquant](https://www.npmjs.com/package/imagemin-pngquant)
  - [imagemin-mozjpeg](https://www.npmjs.com/package/imagemin-mozjpeg)

  For resizing, [sharp](https://www.npmjs.com/package/sharp) package is used.

### `npm run dev`

Uses [concurrently](https://www.npmjs.com/package/concurrently) package. Runs 3 scripts:

- #### `nodemon server`

  Starts the server using [nodemon](https://nodemon.io/) to start responding for requests

- #### `cd client && npm start`

  Starts the React frontend

- #### `cd client && npm run watch-sass`
  Uses [node-sass](https://www.npmjs.com/package/node-sass) package to watch .scss file changes and auto-compile it to css.

### Other Accounts 📫

You can find and get touch with me on these accounts!

- [<img src="https://raw.githubusercontent.com/Delta456/Delta456/master/img/github.png" alt="github logo" width="28"> CrestNiraj12](https://github.com/CrestNiraj12)
- [<img src="https://raw.githubusercontent.com/Delta456/Delta456/master/img/instagram.jpg" alt="instagram logo" width="24"> @crestniraz](https://www.instagram.com/crestniraz/)
- [<img src="https://raw.githubusercontent.com/Delta456/Delta456/master/img/stack.svg" alt="stack logo" width="24"> crestniraz](https://stackoverflow.com/users/7185580/crestniraz)
- [<img src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg" alt="facebook logo" width="24"> Niraj Shrestha](https://www.facebook.com/crestniraz)
