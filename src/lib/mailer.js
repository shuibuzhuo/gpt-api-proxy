const nodemailer = require('nodemailer')
require('dotenv').config()

const config = {
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || 10),
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
}

const transporter = nodemailer.createTransport(config)

async function sendEmail (opt = {}) {
  console.log('sendEmail...')
  const { subject = '', text = ''} = opt;
  if (!subject) {
    console.error('subject required');
    return 
  }

  const mailConfig = {
    from: `划水AI<${process.env.EMAIL_USER}>`, // '昵称<发件人邮箱>'
    subject,
    to: process.env.EMAIL_TO,
    text
  }

  console.log('mainConfig...', mailConfig)

  const res = await transporter.sendMail(mailConfig)
  console.log('Message sent: %s', res.messageId)
  return res
}

module.exports = {
  sendEmail
}
