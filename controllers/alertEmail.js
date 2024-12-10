// emailService.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendEmail = async (to, sender, subject, body) => {
  // const fromEmail = 'reservation-info@cds.ai';
  const fromEmail = 'info@mail.cl2rsv.cds.ai';

  const mailOptions = {
    from: { name: sender, address: fromEmail },
    to,
    subject,
    html: body,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    
    console.log(`Email sent successfully: ${info.messageId}`);
  } catch (error) {
    console.error(`Error sending email: ${error.message}`);
  }
};

module.exports = {
  sendEmail
};
