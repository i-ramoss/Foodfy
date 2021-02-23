const nodemailer = require("nodemailer")

module.exports = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "262d1ad40dd91e",
    pass: "a628e4c4c36e67"
  }
});