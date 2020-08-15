const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");
const _ = require("lodash");
require("dotenv").config({
  path: `.env.${process.env.NODE_ENV.trim() || "development"}`,
});

const config = {
  host: process.env.SMTP_MAILER,
  port: 587,
  secure: false,
  auth: {
    user: process.env.NOREPLY_USER,
    pass: process.env.NOREPLY_PASS,
  },
  ignoreTLS: true,
};

const transporter = nodemailer.createTransport(smtpTransport(config));

const defaultMail = {
  from: `Niraj Shrestha <${process.env.NOREPLY_USER}>`,
};

module.exports = function (mail) {
  mail = _.merge({}, defaultMail, mail);

  transporter.sendMail(mail, function (error, info) {
    if (error) return console.log(error);
    console.log("mail sent:", info.response);
  });
};
