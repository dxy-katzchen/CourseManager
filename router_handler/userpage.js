const { query } = require("../db");

/**
 * @api {post} /userpage/create 创建用户主页
 * @apiDescription 创建用户主页，什么都不用发
 * @apiName createUserpage
 * @apiGroup UserPage
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiIyMDE5MDAzMDEwODIiLCJ1c2VybmFtZSI6ImRpbmd4aW55aSIsInBhc3N3b3JkIjoiIiwiZW1haWwiOiJkaW5neGlueWk2NjY2NjZAMTI2LmNvbSIsImF2YXRhciI6bnVsbCwicm9sZSI6MywidXBpZCI6IjciLCJpYXQiOjE2NjUxNzk3ODMsImV4cCI6NDY2NTI2NjE4M30.qD-lk84NHkE9ePaTcdlC_6n3Gi6B7P0CFNsxJt3jvKw"
 *     }
 * @apiSuccessExample {json} 返回内容:
{
    "status": 0,
    "message": "创建用户主页成功!",
    "data": {
        "upid": 6
    }
}
 * @apiVersion 1.0.0
 */
exports.createUserpage = async (req, res) => {
  //从token解构出用户uid,role
  const { uid, role } = req.user;
  //先查看该用户有没有主页,即user表中的upid字段是否为空
  let sql = "select upid from users where uid=?";
  let result = query(sql, uid);
  if (result) return res.cc("您已有用户主页,不能再次创建");
  //插入一行,只有用户的身份
  sql = "insert into userpage set type=?";
  try {
    result = await query(sql, role);
    if (result.affectedRows !== 1) return res.cc("创建失败");
    const upid = result.insertId;
    //更新users表中用户的upid值
    sql = "update users set upid=? where uid=?";
    result = await query(sql, upid, uid);
    if (result.affectedRows !== 1) return res.cc("创建失败");
    res.send({
      status: 0,
      message: "创建用户主页成功!",
      data: {
        upid,
      },
    });
  } catch (error) {
    res.cc(error);
  }
};
/**
 * @api {post} /userpage/update 更新用户主页信息
 * @apiDescription 更新用户主页信息
 * @apiName updateUserpage
 * @apiGroup UserPage
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiIyMDE5MDAzMDEwODIiLCJ1c2VybmFtZSI6ImRpbmd4aW55aSIsInBhc3N3b3JkIjoiIiwiZW1haWwiOiJkaW5neGlueWk2NjY2NjZAMTI2LmNvbSIsImF2YXRhciI6bnVsbCwicm9sZSI6MywidXBpZCI6IjciLCJpYXQiOjE2NjUxNzk3ODMsImV4cCI6NDY2NTI2NjE4M30.qD-lk84NHkE9ePaTcdlC_6n3Gi6B7P0CFNsxJt3jvKw"
 *     }
 * @apiBody {int} upid 用户主页id,必填
 * @apiBody {string} comment 简介,选填(学生,教师)
 * @apiBody {string} photo 照片地址,选填(学生,教师)
 * @apiBody {string} blog 博客地址,选填(学生)
 * @apiBody {string} book 论文著作,选填(教师)
 * @apiBody {string} search 研究方向,选填(教师)
 * @apiBody {string} teachcourse 教授课程,选填(教师)
 * @apiExample {js} 请求示例:
 * {
 * upid: 7,
 * comment: "我是dxy",
 * book: "《计算机图形学》",
 * search: "计算机图形学",
 * blog: "https://github.com/",
 * photo: "https://sm.ms/image/t5cHgLMCO1XshQj",
 * teachcourse: "数据结构与算法,计算机引论",
 * }
 * 
 * @apiSuccessExample {json} 返回内容:
{
    "status": 0,
    "message": "更新用户主页成功"
}
 * @apiVersion 1.0.0
 */

exports.updateUserpage = async (req, res) => {
  let { upid, ...userpageInfo } = req.body;
  let sql = "select * from userpage where upid=?";
  try {
    let result = await query(sql, upid);
    if (result.length !== 1) return res.cc("找不到该主页");
    sql = "update userpage set ? where upid=?";
    result = await query(sql, userpageInfo, upid);
    if (result.affectedRows !== 1) return res.cc("更新用户主页失败");
    res.cc("更新用户主页成功", 0);
  } catch (error) {
    res.cc(error);
  }
};
/**
 * @api {get} /userpage/info 获取用户主页信息
 * @apiDescription 获取用户主页信息，什么都不用发
 * @apiName getPageInfo
 * @apiGroup UserPage
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiIyMDE5MDAzMDEwODIiLCJ1c2VybmFtZSI6ImRpbmd4aW55aSIsInBhc3N3b3JkIjoiIiwiZW1haWwiOiJkaW5neGlueWk2NjY2NjZAMTI2LmNvbSIsImF2YXRhciI6bnVsbCwicm9sZSI6MywidXBpZCI6IjciLCJpYXQiOjE2NjUxNzk3ODMsImV4cCI6NDY2NTI2NjE4M30.qD-lk84NHkE9ePaTcdlC_6n3Gi6B7P0CFNsxJt3jvKw"
 *     }
 * @apiSuccessExample {json} 返回内容:
{
    "status": 0,
    "message": "获取主页信息成功！",
    "data": [
        {
            "upid": 7,
            "type": 1,
            "comment": "我是dxy",
            "photo": "照片地址",
            "blog": "博客",
            "teachcourse": "教授课程",
            "search": "研究方向",
            "book": "论文著作"
        }
    ]
}
 * @apiVersion 1.0.0
 */

exports.getPageInfo = async (req, res) => {
  const { uid } = req.user;
  let sql = "select * from users where uid=?";
  try {
    let result = await query(sql, uid);
    if (result.length !== 1) return res.cc("获取失败");
    if (!result[0].upid) return res.cc("该用户还没有主页，请先创建");
    const { upid } = result[0];
    sql = "select * from userpage where upid=?";
    result = await query(sql, upid);
    if (result.length !== 1) return res.cc("获取失败");
    res.send({
      status: 0,
      message: "获取主页信息成功！",
      data: result,
    });
  } catch (error) {
    res.cc(error);
  }
};
