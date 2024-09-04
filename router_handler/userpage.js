const { query } = require("../db");

/**
 * @api {post} /userpage/create Creating a user homepage
 * @apiDescription Create a user homepage, nothing needs to be sent
 * @apiName createUserpage
 * @apiGroup UserPage
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiIyMDE5MDAzMDEwODIiLCJ1c2VybmFtZSI6ImRpbmd4aW55aSIsInBhc3N3b3JkIjoiIiwiZW1haWwiOiJkaW5neGlueWk2NjY2NjZAMTI2LmNvbSIsImF2YXRhciI6bnVsbCwicm9sZSI6MywidXBpZCI6IjciLCJpYXQiOjE2NjUxNzk3ODMsImV4cCI6NDY2NTI2NjE4M30.qD-lk84NHkE9ePaTcdlC_6n3Gi6B7P0CFNsxJt3jvKw"
 *     }
 * @apiSuccessExample {json} Return content:
{
    "status": 0,
    "message": "User homepage created successfully!",
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
  let result = await query(sql, uid);

  if (result.upid)
    return res.cc(
      "You already have a user homepage, you cannot create it again"
    );
  //插入一行,只有用户的身份
  sql = "insert into userpage set type=?";
  try {
    result = await query(sql, role);
    if (result.affectedRows !== 1) return res.cc("Create failed");
    const upid = result.insertId;
    //更新users表中用户的upid值
    sql = "update users set upid=? where uid=?";
    result = await query(sql, upid, uid);
    if (result.affectedRows !== 1) return res.cc("Create failed");
    res.send({
      status: 0,
      message: "Create user homepage successfully!",
      data: {
        upid,
      },
    });
  } catch (error) {
    res.cc(error);
  }
};
/**
 * @api {post} /userpage/update Updating user homepage information
 * @apiDescription Update user homepage information
 * @apiName updateUserpage
 * @apiGroup UserPage
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiIyMDE5MDAzMDEwODIiLCJ1c2VybmFtZSI6ImRpbmd4aW55aSIsInBhc3N3b3JkIjoiIiwiZW1haWwiOiJkaW5neGlueWk2NjY2NjZAMTI2LmNvbSIsImF2YXRhciI6bnVsbCwicm9sZSI6MywidXBpZCI6IjciLCJpYXQiOjE2NjUxNzk3ODMsImV4cCI6NDY2NTI2NjE4M30.qD-lk84NHkE9ePaTcdlC_6n3Gi6B7P0CFNsxJt3jvKw"
 *     }
 * @apiBody {int} upid User homepage id, required
 * @apiBody {string} comment Introduction, optional (student, teacher)
 * @apiBody {string} photo Photo address, optional (student, teacher)
 * @apiBody {string} blog Blog address, optional (student)
 * @apiBody {string} book Thesis and papers, optional (teacher)
 * @apiBody {string} search Research direction, optional (teacher)
 * @apiBody {string} teachcourse Teaching courses, optional (teacher)
 * @apiExample {js} Request example:
 * {
 * upid: 7,
 * comment: "我是dxy",
 * book: "《computer graphics》",
 * search: "computer graphics",
 * blog: "https://github.com/",
 * photo: "https://sm.ms/image/t5cHgLMCO1XshQj",
 * teachcourse: "Data Structures and Algorithms, Introduction to Computing",
 * }
 * 
 * @apiSuccessExample {json} Return content:
{
    "status": 0,
    "message": "Update user homepage successfully!"
}
 * @apiVersion 1.0.0
 */

exports.updateUserpage = async (req, res) => {
  let { upid, ...userpageInfo } = req.body;
  let sql = "select * from userpage where upid=?";
  try {
    let result = await query(sql, upid);
    if (result.length !== 1) return res.cc("User homepage not found");
    sql = "update userpage set ? where upid=?";
    result = await query(sql, userpageInfo, upid);
    if (result.affectedRows !== 1) return res.cc("Update user homepage failed");
    res.cc("Update user homepage successfully!", 0);
  } catch (error) {
    res.cc(error);
  }
};
/**
 * @api {get} /userpage/info Getting user homepage information
 * @apiDescription Get user homepage information, nothing needs to be sent
 * @apiName getPageInfo
 * @apiGroup UserPage
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiIyMDE5MDAzMDEwODIiLCJ1c2VybmFtZSI6ImRpbmd4aW55aSIsInBhc3N3b3JkIjoiIiwiZW1haWwiOiJkaW5neGlueWk2NjY2NjZAMTI2LmNvbSIsImF2YXRhciI6bnVsbCwicm9sZSI6MywidXBpZCI6IjciLCJpYXQiOjE2NjUxNzk3ODMsImV4cCI6NDY2NTI2NjE4M30.qD-lk84NHkE9ePaTcdlC_6n3Gi6B7P0CFNsxJt3jvKw"
 *     }
 * @apiSuccessExample {json} Return content:
{
    "status": 0,
    "message": "Get user homepage information successfully!",
    "data": [
        {
            "upid": 7,
            "type": 1,
            "comment": "Introduction",
            "photo": "Photo address",
            "blog": "Blog",
            "teachcourse": "Teaching courses",
            "search": "Research direction",
            "book": "Thesis and papers"
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
    if (result.length !== 1) return res.cc("Get failed");
    if (!result[0].upid)
      return res.cc(
        "The user does not have a homepage, please create one first"
      );
    const { upid } = result[0];
    sql = "select * from userpage where upid=?";
    result = await query(sql, upid);
    if (result.length !== 1) return res.cc("Get failed");
    res.send({
      status: 0,
      message: "Get user homepage information successfully!",
      data: result[0],
    });
  } catch (error) {
    res.cc(error);
  }
};
