const { query } = require("../db");
const bcypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { jwtSecretKey } = require("../config");
//自然人验证
const svgCaptcha = require("svg-captcha");
const { sendEmail } = require("../utils/sendEmail");
//保存用户email和验证码键值对的map
const checkCodeMap = new Map();
//生成六位随机数的方法
const randomFn = () =>
  Array.from({ length: 6 }, (_) => Math.floor(Math.random() * 10)).join("");
/**
 * @api {get} /user/captcha Captcha
 * @apiDescription Captcha, send a svg and a verification code content to the front desk
 * @apiName getCaptcha
 * @apiGroup User

 * @apiSuccessExample {json} Return content:
 {
    "status": 0,
    "message": "Succeeded in getting captcha",
    "data":{
 "text": "502f",
    "svg_img": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"150\" height=\"50\" viewBox=\"0,0,150,..."
    }
   
 }
 * @apiVersion 1.0.0
 */
//自然人验证
exports.getCaptcha = async (req, res) => {
  try {
    const captcha = svgCaptcha.create();
    const text = captcha.text;
    const svg_img = captcha.data;

    res.send({
      status: 0,
      message: "Succeeded in getting captcha",
      data: {
        text,
        svg_img,
      },
    });
  } catch (error) {
    res.cc(error);
  }
};
/**
 * @api {post} /user/register Register
 * @apiDescription User register
 * @apiName register
 * @apiGroup User
 * @apiBody {string{1..12}} username username
 * @apiBody {string{6..12}} password Password, can have numbers and letters
 * @apiBody {string{12}} uid id number, only 12 digits
 * @apiBody {string} email Email, must be in email format
 * @apiBody {number=1,2,3} role=1 Identity, 1 for student, 2 for teacher, 3 for administrator
 * @apiExample {js} Request example:
 * {
 *     uid:"201900301082",
 *     username:"dxxxxy",
 *     password:"666666",
 *     email:"55555@126.com",
 *     role:1,
 * }
 * @apiSuccessExample {json} Return content:
 * {
    "status": 0,
    "message": "Register successfully!"
}
 * @apiVersion 1.0.0
 */
exports.register = async (req, res) => {
  const userinfo = req.body;

  //查重,学号和邮箱不能一样

  const sql1 = "select * from users where uid=? or email=?";
  try {
    const result1 = await query(sql1, userinfo.id, userinfo.email);
    if (result1.length > 0) {
      return res.cc("id number or email has been registered");
    }
    userinfo.password = bcypt.hashSync(userinfo.password, 10);
    const sql2 = "insert into users set ?";
    const result2 = await query(sql2, userinfo);

    if (result2.affectedRows !== 1) return res.cc("Register failed");
    res.cc("Register successfully!", 0);
  } catch (error) {
    res.cc(error);
  }
};
/**
 * @api {post} /user/login Login
 * @apiDescription User login
 * @apiName login
 * @apiGroup User
 * @apiBody {string{12}} uid id number, only 12 digits
 * @apiBody {string{6..12}} password Password, can have numbers and letters
 * @apiExample {js} Request example:
 * {
 *     uid:"201900301082",
 *     password:"666666",
 * }
 * @apiSuccessExample {json} Return content:
 * 
{
    "status": 0,
    "message": "Login successfully!",
    "token": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiIyMDE5MDAzMDEwODIiLCJ1c2VybmFtZSI6ImRpbmd4aW55aSIsInBhc3N3b3JkIjoiIiwiZW1haWwiOiJkaW5neGlueWk2NjY2NjZAMTI2LmNvbSIsImF2YXRhciI6bnVsbCwicm9sZSI6MywidXBpZCI6IjciLCJpYXQiOjE2NjUxNzk3ODMsImV4cCI6NDY2NTI2NjE4M30.qD-lk84NHkE9ePaTcdlC_6n3Gi6B7P0CFNsxJt3jvKw"
}
   
 * @apiVersion 1.0.0
 */

exports.login = async (req, res) => {
  const userinfo = req.body;
  const sql1 = "select * from users where uid=?";
  try {
    const result = await query(sql1, userinfo.uid);
    if (result.length !== 1) return res.cc("You haven't registered yet");
    const compareResult = bcypt.compareSync(
      userinfo.password,
      result[0].password
    );
    if (!compareResult) return res.cc("Password error");
    //登陆成功,生成Token
    //剔除敏感信息
    const user = { ...result[0], password: "" };
    const tokenStr = jwt.sign(user, jwtSecretKey, { expiresIn: "365d" });

    res.send({
      status: 0,
      message: "Login successfully!",
      token: "Bearer " + tokenStr,
    });
  } catch (error) {
    res.cc(error);
  }
};

/**
 * @api {post} /user/lostPwd/sendEmail Send email
 * @apiDescription Send an email with a verification code to the user's email
 * @apiName sendEmail
 * @apiGroup User
 * @apiBody {string} email Email, must be in email format
 * @apiExample {js} Request example:
 * {
 *     email:"55555@126.com",
 * }
 * @apiSuccessExample {json} Return content:
   {
     
    "status": 0,
    "message": "Send successfully"

   }
 * @apiVersion 1.0.0
 */
exports.sendEmail = async (req, res) => {
  /**
   * 忘记密码处理步骤:
   * 1.查看有无此邮箱
   * 2.生成一个随机验证码,发邮件
   */
  const { email } = req.body;
  //1.查看有无此邮箱
  const sql = "select * from users where email=?";
  try {
    const result = await query(sql, email);
    if (result.length === 0) return res.cc("No such user");
    if (result.length !== 1) return res.cc("Send failed");
    //2.有这个邮箱,生成验证码,发邮件
    const checkCode = randomFn();
    checkCodeMap.set(email, checkCode);
    await sendEmail(email, checkCode);
    res.cc("Send successfully", 0);
  } catch (error) {
    res.cc(error);
  }
};

/**
 * @api {post} /user/lostPwd/varify Verify user email
 * @apiDescription User sends a verification code to retrieve their password
 * @apiName varify
 * @apiGroup User
 * @apiBody {string} email Email, must be in email format
 * @apiBody {string{6}} checkCode Verification code, must be 6 digits
 * @apiExample {js} Request example:
 * {
 *     email:"55555@126.com",
 *     checkCode:"666666"
 * }
 * @apiSuccessExample {json} Return content:
{
    "status": 0,
    "message": "Verify successfully"
}
 * @apiVersion 1.0.0
 */
exports.varify = async (req, res) => {
  const { email, checkCode } = req.body;
  //1.再次检验有无此邮箱,防止用户修改
  const sql = "select * from users where email=?";
  try {
    const result = await query(sql, email);
    if (result.length === 0) return res.cc("No such user");
    if (result.length !== 1) return res.cc("Verify failed");
    const is_equal = checkCodeMap.get(email) === checkCode;
    if (!is_equal) return res.cc("Verification code error, please re-enter");
    checkCodeMap.delete(email);
    res.cc("Verify successfully", 0);
  } catch (error) {
    res.cc(error);
  }
};

/**
 * @api {post} /user/lostPwd/resetPwd Reset password
 * @apiDescription User resets their password
 * @apiName resetPwd
 * @apiGroup User
 * @apiBody {string} email Mailbox, must comply with the mailbox format
 * @apiBody {string{6..12}} password Password, can have numbers and letters
 * @apiBody {string{6..12}} passwordRepeat Confirm input password, must be the same as password
 * @apiExample {js} Request example:
 * {
 *     email:"55555@126.com",
 *     password:"12345678",
 *     passwordRepeat:"12345678"
 * }
 * @apiSuccessExample {json} Return content:
{
    "status": 0,
    "message": "Reset password successfully!"
}
 * @apiVersion 1.0.0
 */
exports.resetPwd = async (req, res) => {
  /**
   * Reset password:
   * 1.Enter new password
   * 2.Modify password
   */
  let { password, email } = req.body;

  let sql = "select * from users where email=?";
  try {
    let result = await query(sql, email);
    if (result.length !== 1) return res.cc("No such user");
    //修改的密码不能和之前的密码一样
    const compareResult = bcypt.compareSync(password, result[0].password);
    if (compareResult)
      return res.cc("New password cannot be the same as the old password!");
    password = bcypt.hashSync(password, 10);
    sql = "update users set password=? where email=?";
    result = await query(sql, password, email);
    if (result.affectedRows !== 1) return res.cc("Reset password failed");
    res.cc("Reset password successfully!", 0);
  } catch (error) {
    res.cc(error);
  }
};
