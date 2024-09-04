const nodemailer = require("nodemailer");

// 开启一个 SMTP 连接池
const transporter = nodemailer.createTransport({
  host: "smtp.qq.com",
  secureConnection: true, // use SSL
  port: 465,
  secure: true, // secure:true for port 465, secure:false for port 587
  auth: {
    user: "1363867975@qq.com",
    pass: "zgdkmferloeqjfjd", // QQ邮箱需要使用授权码
  },
});

// 设置邮件内容（谁发送什么给谁）
const mailOptionsMaker = (email, checkCode) => ({
  from: '"dxy666666" <1363867975@qq.com>', // 发件人
  to: `${email}`, // 收件人
  subject: "CourseManager邮箱验证", // 主题
  text: "This is a test email from Node.js", // plain text body
  html: `<div>This is CourseManager, your verification code is<h1'>${checkCode}</h1> </div>`, // html body
});

const sendEmail = (email, checkCode) =>
  new Promise((resolve, reject) => {
    const mailOptions = mailOptionsMaker(email, checkCode);
    // 使用先前创建的传输器的 sendMail 方法传递消息对象
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        reject(error);
      }
      resolve();
    });
  });

module.exports = {
  sendEmail,
};
