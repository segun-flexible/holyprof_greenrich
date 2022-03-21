const nodemailer = require("nodemailer")
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'peervestceo@gmail.com',
    pass: '07018484772'
      },
  tls: {
      rejectUnauthorized: false
    },
});

module.exports = transporter


