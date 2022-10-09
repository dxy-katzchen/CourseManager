const { query } = require("../db");
const bcypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { jwtSecretKey } = require("../config");
const { sendEmail } = require("../utils/sendEmail");
//保存用户email和验证码键值对的map
const checkCodeMap = new Map();
//生成六位随机数的方法
const randomFn = () =>
  Array.from({ length: 6 }, (_) => Math.floor(Math.random() * 10)).join("");

/**
 * @api {post} /users/register 注册
 * @apiDescription 用户注册
 * @apiName register
 * @apiGroup User
 * @apiBody {string{1..12}} username 用户名
 * @apiBody {string{6..12}} password 密码,可以有数字和字母
 * @apiBody {string{12}} uid 学/工号 ,只能12位
 * @apiBody {string} email 邮箱,必须符合邮箱格式
 * @apiBody {number=1,2,3} role=1 身份,1为学生,2为老师,3为管理员
 * @apiExample {js} 请求示例:
 * {
 *     uid:"201900301082",
 *     username:"dxxxxy",
 *     password:"666666",
 *     email:"55555@126.com",
 *     role:1,
 * }
 * @apiSuccessExample {json} 返回内容:
 * {
    "status": 0,
    "message": "注册成功!"
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
      return res.cc("学号或邮箱有重复");
    }
    userinfo.password = bcypt.hashSync(userinfo.password, 10);
    const sql2 = "insert into users set ?";
    const result2 = await query(sql2, userinfo);

    if (result2.affectedRows !== 1) return res.cc("注册失败");
    res.cc("注册成功!", 0);
  } catch (error) {
    res.cc(error);
  }
};
/**
 * @api {post} /users/login 登录
 * @apiDescription 用户登录
 * @apiName login
 * @apiGroup User
 * @apiBody {string{12}} uid 学/工号 ,只能12位
 * @apiBody {string{6..12}} password 密码,可以有数字和字母
 * @apiExample {js} 请求示例:
 * {
 *     uid:"201900301082",
 *     password:"666666",
 * }
 * @apiSuccessExample {json} 返回内容:
 * 
{
    "status": 0,
    "message": "登录成功!",
    "token": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiIyMDE5MDAzMDEwODIiLCJ1c2VybmFtZSI6ImRpbmd4aW55aSIsInBhc3N3b3JkIjoiIiwiZW1haWwiOiJkaW5neGlueWk2NjY2NjZAMTI2LmNvbSIsImF2YXRhciI6bnVsbCwicm9sZSI6MywidXBpZCI6IjciLCJpYXQiOjE2NjUxNzk3ODMsImV4cCI6NDY2NTI2NjE4M30.qD-lk84NHkE9ePaTcdlC_6n3Gi6B7P0CFNsxJt3jvKw"
}
   
 * @apiVersion 1.0.0
 */

exports.login = async (req, res) => {
  const userinfo = req.body;
  const sql1 = "select * from users where uid=?";
  try {
    const result = await query(sql1, userinfo.uid);
    if (result.length !== 1) return res.cc("您还没有注册");
    const compareResult = bcypt.compareSync(
      userinfo.password,
      result[0].password
    );
    if (!compareResult) return res.cc("密码错误");
    //登陆成功,生成Token
    //剔除敏感信息
    const user = { ...result[0], password: "" };
    const tokenStr = jwt.sign(user, jwtSecretKey, { expiresIn: "24h" });

    res.send({
      status: 0,
      message: "登录成功!",
      token: "Bearer " + tokenStr,
    });
  } catch (error) {
    res.cc(error);
  }
};

/**
 * @api {post} /users/lostPwd/sendEmail 发送验证码
 * @apiDescription 向用户邮箱发送有验证码的邮件
 * @apiName sendEmail
 * @apiGroup User
 * @apiBody {string} email 邮箱,必须符合邮箱格式
 * @apiExample {js} 请求示例:
 * {
 *     email:"55555@126.com",
 * }
 * @apiSuccessExample {json} 返回内容:
   {
     
    "status": 0,
    "message": "发送成功"

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
    if (result.length === 0) return res.cc("没有此用户");
    if (result.length !== 1) return res.cc("发送失败");
    //2.有这个邮箱,生成验证码,发邮件
    const checkCode = randomFn();
    checkCodeMap.set(email, checkCode);
    await sendEmail(email, checkCode);
    res.cc("发送成功", 0);
  } catch (error) {
    res.cc(error);
  }
};

/**
 * @api {post} /users/lostPwd/varify 验证用户邮箱
 * @apiDescription 用户发送验证码找回密码
 * @apiName varify
 * @apiGroup User
 * @apiBody {string} email 邮箱,必须符合邮箱格式
 * @apiBody {string{6}} checkCode 验证码,必须6位
 * @apiExample {js} 请求示例:
 * {
 *     email:"55555@126.com",
 *     checkCode:"666666"
 * }
 * @apiSuccessExample {json} 返回内容:
{
    "status": 0,
    "message": "验证成功"
}
 * @apiVersion 1.0.0
 */
exports.varify = async (req, res) => {
  const { email, checkCode } = req.body;
  //1.再次检验有无此邮箱,防止用户修改
  const sql = "select * from users where email=?";
  try {
    const result = await query(sql, email);
    if (result.length === 0) return res.cc("没有此用户");
    if (result.length !== 1) return res.cc("验证失败");
    const is_equal = checkCodeMap.get(email) === checkCode;
    if (!is_equal) return res.cc("验证码错误,请重新输入");
    checkCodeMap.delete(email);
    res.cc("验证成功", 0);
  } catch (error) {
    res.cc(error);
  }
};

/**
 * @api {post} /users/lostPwd/resetPwd 重置密码
 * @apiDescription 用户重置密码
 * @apiName resetPwd
 * @apiGroup User
 * @apiBody {string} email 邮箱,必须符合邮箱格式
 * @apiBody {string{6..12}} password 密码,可以有数字和字母
 * @apiBody {string{6..12}} passwordRepeat 确认输入密码,必须和password值相同
 * @apiExample {js} 请求示例:
 * {
 *     email:"55555@126.com",
 *     password:"12345678",
 *     passwordRepeat:"12345678"
 * }
 * @apiSuccessExample {json} 返回内容:
{
    "status": 0,
    "message": "修改密码成功!"
}
 * @apiVersion 1.0.0
 */
exports.resetPwd = async (req, res) => {
  /**
   * 重设密码:
   * 1.输入新密码
   * 2.修改密码
   */
  let { password, email } = req.body;

  let sql = "select * from users where email=?";
  try {
    let result = await query(sql, email);
    if (result.length !== 1) return res.cc("用户不存在");
    //修改的密码不能和之前的密码一样
    const compareResult = bcypt.compareSync(password, result[0].password);
    if (compareResult) return res.cc("新密码不能和旧密码一样!");
    password = bcypt.hashSync(password, 10);
    sql = "update users set password=? where email=?";
    result = await query(sql, password, email);
    if (result.affectedRows !== 1) return res.cc("修改密码失败");
    res.cc("修改密码成功!", 0);
  } catch (error) {
    res.cc(error);
  }
};
