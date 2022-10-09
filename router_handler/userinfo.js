const { query } = require("../db");
const bcypt = require("bcryptjs");

/**
 * @api {get} /my/userinfo 查询用户基本信息
 * @apiDescription 查询用户基本信息
 * @apiName getUserInfo
 * @apiGroup UserInfo
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiIyMDE5MDAzMDEwODIiLCJ1c2VybmFtZSI6ImRpbmd4aW55aSIsInBhc3N3b3JkIjoiIiwiZW1haWwiOiJkaW5neGlueWk2NjY2NjZAMTI2LmNvbSIsImF2YXRhciI6bnVsbCwicm9sZSI6MywidXBpZCI6IjciLCJpYXQiOjE2NjUxNzk3ODMsImV4cCI6NDY2NTI2NjE4M30.qD-lk84NHkE9ePaTcdlC_6n3Gi6B7P0CFNsxJt3jvKw"
 *     }
 * @apiSuccessExample {json} 返回内容:
{
    "status": 0,
    "message": "查询用户基本信息成功!",
    "data": {
        "uid": "201900301082",
        "username": "dxy",
        "email": "1363867975@qq.com",
        "avatar": null,
        "role": 1,
        "upid": null
    }
}
 * @apiVersion 1.0.0
 */
exports.getUserInfo = async (req, res) => {
  const sql =
    "select uid,username,email,avatar,role,upid from users where uid=?";
  try {
    const result = await query(sql, req.user.uid);
    if (result.length !== 1) return res.cc("查询用户基本信息失败!");
    res.send({
      status: 0,
      message: "查询用户基本信息成功!",
      data: result[0],
    });
  } catch (error) {
    res.cc(error);
  }
};
/**
 * @api {post} /my/userinfo 修改用户基本信息
 * @apiDescription 修改用户基本信息
 * @apiName updateUserInfo
 * @apiGroup UserInfo
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiIyMDE5MDAzMDEwODIiLCJ1c2VybmFtZSI6ImRpbmd4aW55aSIsInBhc3N3b3JkIjoiIiwiZW1haWwiOiJkaW5neGlueWk2NjY2NjZAMTI2LmNvbSIsImF2YXRhciI6bnVsbCwicm9sZSI6MywidXBpZCI6IjciLCJpYXQiOjE2NjUxNzk3ODMsImV4cCI6NDY2NTI2NjE4M30.qD-lk84NHkE9ePaTcdlC_6n3Gi6B7P0CFNsxJt3jvKw"
 *     }
 * @apiBody {string{1..12}} username 用户名
 * @apiBody {string} email 邮箱,必须符合邮箱格式
 * @apiBody {string} avatar 头像地址,可选
 * 
 * @apiExample {js} 请求示例:
 * {
 *     username:"dxxxxy",
 *     email:"55555@126.com",
 *     upid:1,//可选
 *     avatar:"https://sm.ms/image/8yBIwEGVKxNeadM"//可选
 * }
 * @apiSuccessExample {json} 返回内容:
{
    "status": 0,
    "message": "修改基本信息成功!"
}
 * @apiVersion 1.0.0
 */
exports.updateUserInfo = async (req, res) => {
  const userinfo = req.body;
  const sql = "update users set ? where uid=?";
  try {
    let result = await query(sql, userinfo, req.user.uid);
    if (result.affectedRows !== 1) return res.cc("修改基本信息失败");
    return res.cc("修改基本信息成功!", 0);
  } catch (error) {
    res.cc(error);
  }
};

/**
 * @api {post} /my/updatepwd 修改用户密码
 * @apiDescription 修改用户密码,之所以这个接口单独写,是为了防止token盗用而修改密码的情况
 * @apiName updatePassword
 * @apiGroup UserInfo
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiIyMDE5MDAzMDEwODIiLCJ1c2VybmFtZSI6ImRpbmd4aW55aSIsInBhc3N3b3JkIjoiIiwiZW1haWwiOiJkaW5neGlueWk2NjY2NjZAMTI2LmNvbSIsImF2YXRhciI6bnVsbCwicm9sZSI6MywidXBpZCI6IjciLCJpYXQiOjE2NjUxNzk3ODMsImV4cCI6NDY2NTI2NjE4M30.qD-lk84NHkE9ePaTcdlC_6n3Gi6B7P0CFNsxJt3jvKw"
 *     }
 * @apiBody {string{6..12}} oldPwd 旧密码,原来的密码,6-12位数字和字母的组合
 * @apiBody {string{6..12}} newPwd 新密码,和旧密码不能一样,格式同上
 * 
 * @apiExample {js} 请求示例:
 * {
      oldPwd:"123456789",
      newPwd:"dxy666666"
 * }
 * @apiSuccessExample {json} 返回内容:
{
    "status": 0,
    "message": "修改密码成功!"
}
 * @apiVersion 1.0.0
 */
exports.updatePassword = async (req, res) => {
  let sql = "select * from users where uid=?";
  try {
    let result = await query(sql, req.user.uid);
    if (result.length !== 1) return res.cc("用户不存在!");
    const compareResult = bcypt.compareSync(
      req.body.oldPwd,
      result[0].password
    );
    if (!compareResult) return res.cc("原密码错误!");
    const newPwd = bcypt.hashSync(req.body.newPwd, 10);
    sql = "update users set password=? where uid=?";
    result = await query(sql, newPwd, req.user.uid);
    if (result.affectedRows !== 1) res.cc("修改密码失败!");
    res.cc("修改密码成功!", 0);
  } catch (error) {
    res.cc(error);
  }
};
