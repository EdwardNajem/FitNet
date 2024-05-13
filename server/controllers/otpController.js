const nodemailer = require('nodemailer');

function generateOTP() {
  const otpLength = 6;
  return Math.floor(100000 + Math.random() * 900000)
    .toString()
    .substr(0, otpLength);
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'edward.najem65@gmail.com', // Your Gmail email address
    pass: 'oove lpzc xcwn msvh', // Your Gmail password
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const sendOTPController = async (req, res) => {
  const { email } = req.body;
  try {
    const otp = generateOTP();
    const mailOptions = {
      from: 'edward.najem65@gmail.com',
      to: email,
      subject: 'Your OTP for registration',
      text: `Your OTP is: ${otp}`,
    };
    await transporter.sendMail(mailOptions);
    console.log(otp);
    res.json({ otp: otp, message: 'OTP sent successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send OTP' });
  }
};

module.exports = { sendOTPController };
