const nodemailer = require("nodemailer")
const transporter = nodemailer.createTransport({
  service: 'gmail',
  /* logger: true,
  debug: true, */
  secureConnection: false,
  auth: {
    user: 'crypticlifeinvestment@gmail.com',
    pass: 'ayodeleomoalidu1'
      },
  tls: {
      rejectUnauthorized: false
    },
});

module.exports = transporter


