const { query } = require("../db");
const bcypt = require("bcryptjs");

/**
 * @api {get} /my/userinfo Get user basic information
 * @apiDescription Get user basic information
 * @apiName getUserInfo
 * @apiGroup UserInfo
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiIyMDE5MDAzMDEwODIiLCJ1c2VybmFtZSI6ImRpbmd4aW55aSIsInBhc3N3b3JkIjoiIiwiZW1haWwiOiJkaW5neGlueWk2NjY2NjZAMTI2LmNvbSIsImF2YXRhciI6bnVsbCwicm9sZSI6MywidXBpZCI6IjciLCJpYXQiOjE2NjUxNzk3ODMsImV4cCI6NDY2NTI2NjE4M30.qD-lk84NHkE9ePaTcdlC_6n3Gi6B7P0CFNsxJt3jvKw"
 *     }
 * @apiSuccessExample {json} Return content:
{
    "status": 0,
    "message": "Get user basic information successfully!",
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
    if (result.length !== 1)
      return res.cc("Get user basic information failed!");
    res.send({
      status: 0,
      message: "Get user basic information successfully!",
      data: result[0],
    });
  } catch (error) {
    res.cc(error);
  }
};
/**
 * @api {post} /my/userinfo Modify user basic information
 * @apiDescription Modify user basic information
 * @apiName updateUserInfo
 * @apiGroup UserInfo
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiIyMDE5MDAzMDEwODIiLCJ1c2VybmFtZSI6ImRpbmd4aW55aSIsInBhc3N3b3JkIjoiIiwiZW1haWwiOiJkaW5neGlueWk2NjY2NjZAMTI2LmNvbSIsImF2YXRhciI6bnVsbCwicm9sZSI6MywidXBpZCI6IjciLCJpYXQiOjE2NjUxNzk3ODMsImV4cCI6NDY2NTI2NjE4M30.qD-lk84NHkE9ePaTcdlC_6n3Gi6B7P0CFNsxJt3jvKw"
 *     }
 * @apiBody {string{1..12}} username Username, optional
 * @apiBody {string} email Email, must be a valid email address, optional
 * @apiBody {string} avatar Avatar address, optional
 * 
 * @apiExample {js} 请求示例:
 * {
 *     username:"dxxxxy",
 *     email:"55555@126.com",
 *     avatar:"https://sm.ms/image/8yBIwEGVKxNeadM"//可选
 * }
 * @apiSuccessExample {json} Return content:
{
    "status": 0,
    "message": "Modify user basic information successfully!"
}
 * @apiVersion 1.0.0
 */
exports.updateUserInfo = async (req, res) => {
  const userinfo = req.body;
  const sql = "update users set ? where uid=?";
  try {
    let result = await query(sql, userinfo, req.user.uid);
    if (result.affectedRows !== 1)
      return res.cc("Modify user basic information failed!");
    return res.cc("Modify user basic information successfully!", 0);
  } catch (error) {
    res.cc(error);
  }
};

/**
 * @api {post} /my/updatepwd Modify user password
 * @apiDescription Modify user password, this interface is written separately to prevent the situation where the token is stolen and the password is modified
 * @apiName updatePassword
 * @apiGroup UserInfo
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiIyMDE5MDAzMDEwODIiLCJ1c2VybmFtZSI6ImRpbmd4aW55aSIsInBhc3N3b3JkIjoiIiwiZW1haWwiOiJkaW5neGlueWk2NjY2NjZAMTI2LmNvbSIsImF2YXRhciI6bnVsbCwicm9sZSI6MywidXBpZCI6IjciLCJpYXQiOjE2NjUxNzk3ODMsImV4cCI6NDY2NTI2NjE4M30.qD-lk84NHkE9ePaTcdlC_6n3Gi6B7P0CFNsxJt3jvKw"
 *     }
 * @apiBody {string{6..12}} oldPwd Old password, the original password, a combination of 6-12 digits and letters
 * @apiBody {string{6..12}} newPwd New password, cannot be the same as the old password, format same as above
 * 
 * @apiExample {js} Request example:
 * {
      oldPwd:"123456789",
      newPwd:"dxy666666"
 * }
 * @apiSuccessExample {json} Return content:
{
    "status": 0,
    "message": "Modify password successfully!"
}
 * @apiVersion 1.0.0
 */
exports.updatePassword = async (req, res) => {
  let sql = "select * from users where uid=?";
  try {
    let result = await query(sql, req.user.uid);
    if (result.length !== 1) return res.cc("User does not exist!");
    const compareResult = bcypt.compareSync(
      req.body.oldPwd,
      result[0].password
    );
    if (!compareResult) return res.cc("Original password error!");
    const newPwd = bcypt.hashSync(req.body.newPwd, 10);
    sql = "update users set password=? where uid=?";
    result = await query(sql, newPwd, req.user.uid);
    if (result.affectedRows !== 1) res.cc("Modify password failed!");
    res.cc("Modify password successfully!", 0);
  } catch (error) {
    res.cc(error);
  }
};
