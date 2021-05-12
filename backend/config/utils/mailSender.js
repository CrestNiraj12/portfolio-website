const mailer = require("./mailer");

exports.sendMail = (email, subject, html) => {
  mailer({
    to: email,
    subject,
    html,
  });
};

exports.sendResetMail = (email, link) => {
  const html = `<h2>Password Reset Request</h2><p>Please click on the following link to reset your password.</p><a href="${link}">${link}</a><p>This token is only valid for 1 hour.</p>
            <p>If it wasn't you or if you have any questions, please email me at <a href="mailto:hello@nirajshrestha.live">hello@nirajshrestha.live</a>.</p><p>Regards,</p><p><a href="nirajshrestha.live">Niraj Shrestha</a></p>`;
  this.sendMail(email, "Confirm password change", html);
};

exports.sendActivationMail = (email, fullname, role, link) => {
  const html = `<h2>Hello, ${fullname}!</h2><h3>My new ${role}!</h3><p>Please click on the following link to activate your account.</p><a href="${link}">${link}</a><p>This token is only valid for 24 hours. After that, you need to re-register your account!</p>
            <p>If you have any questions, please email me at <a href="mailto:hello@nirajshrestha.live">hello@nirajshrestha.live</a>.</p><p>Regards,</p><p><a href="nirajshrestha.live">Niraj Shrestha</a></p>`;
  this.sendMail(email, "Confirm your email address", html);
};
