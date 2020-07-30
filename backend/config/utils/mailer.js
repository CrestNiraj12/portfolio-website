const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");
const _ = require("lodash");
require("dotenv").config();

const config = {
  host: "smtp.nirajshrestha.tech",
  port: 587,
  secure: false,
  auth: {
    user: process.env.USER,
    pass: process.env.PASS,
  },
  ignoreTLS: true,
};

const transporter = nodemailer.createTransport(smtpTransport(config));

const defaultMail = {
  from: "Admin <admin@nirajshrestha.tech>",
  text: "Hedo testing!",
};

module.exports = function (mail) {
  mail = _.merge({}, defaultMail, mail);

  transporter.sendMail(mail, function (error, info) {
    if (error) return console.log(error);
    console.log("mail sent:", info.response);
  });
};
