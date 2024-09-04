const { query } = require("../db");
//时间格式化
const sd = require("silly-datetime");
/**
 * @api {post} /manage/create Create an article(Admin)
 * @apiDescription Create a school administration bulletin and don't send anything out
 * @apiName createManagePage
 * @apiGroup studentManage
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiIyMDE5MDAzMDEwODIiLCJ1c2VybmFtZSI6ImRpbmd4aW55aSIsInBhc3N3b3JkIjoiIiwiZW1haWwiOiJkaW5neGlueWk2NjY2NjZAMTI2LmNvbSIsImF2YXRhciI6bnVsbCwicm9sZSI6MywidXBpZCI6IjciLCJpYXQiOjE2NjUxNzk3ODMsImV4cCI6NDY2NTI2NjE4M30.qD-lk84NHkE9ePaTcdlC_6n3Gi6B7P0CFNsxJt3jvKw"
 *     }
 * @apiSuccessExample {json} Back to content:
{
    "status": 1,
    "message": {
        "status": 0,
        "message": "Successful creation of article",
        "mid": 6
    }
}
 * @apiVersion 1.0.0
 */
exports.createManagePage = async (req, res) => {
  //需要校验权限
  const { role, uid } = req.user;
  if (role !== 3) return res.cc("You don't have permission");
  //对Date对象进行格式化
  const createTime = sd.format(new Date(), "YYYY-MM-DD HH:mm");
  let sql = "insert into stu_teach_manage set uid=? , create_time=?";
  try {
    let result = await query(sql, uid, createTime);
    if (result.affectedRows !== 1) return res.cc("Failed to create article");
    const mid = result.insertId;
    res.send({
      status: 0,
      message: "Successful creation of article",
      mid,
    });
  } catch (error) {
    res.cc(error);
  }
};
/**
 * @api {post} /manage/update Update article information(Admin)
 * @apiDescription Update article
 * @apiName updateManagePage
 * @apiGroup studentManage
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiIyMDE5MDAzMDEwODIiLCJ1c2VybmFtZSI6ImRpbmd4aW55aSIsInBhc3N3b3JkIjoiIiwiZW1haWwiOiJkaW5neGlueWk2NjY2NjZAMTI2LmNvbSIsImF2YXRhciI6bnVsbCwicm9sZSI6MywidXBpZCI6IjciLCJpYXQiOjE2NjUxNzk3ODMsImV4cCI6NDY2NTI2NjE4M30.qD-lk84NHkE9ePaTcdlC_6n3Gi6B7P0CFNsxJt3jvKw"
 *     }
 * @apiBody {int} mid article ID, required
 * @apiBody {int} type article type, optional, 1--Social Practice, 2--Extracurricular Activities, 3--Research Achievements
 * @apiBody {string} title article title, optional
 * @apiBody {string} content article content, optional
 * @apiBody {string} author Author, optional
 * @apiBody {string} banner_pic Banner picture address, optional
 * @apiExample {js} Request example:
 * {
        mid: 19
        type: 2
        banner_pic: "https://sm.ms/image/8yBIwEGVKxNeadM"
        author: "(*^_^*)"
        title: "xxx"
        content: "xxx"
 * }
 * 
 * @apiSuccessExample {json} Response content:
{
    "status": 0,
    "message": "Update article information successfully!"
}
 * @apiVersion 1.0.0
 */
exports.updateManagePage = async (req, res) => {
  //需要校验权限
  const { role } = req.user;
  if (role !== 3) return res.cc("You don't have permission");
  const { mid, ...pageinfo } = req.body;
  //1.查看有没有这篇id对应的文章
  let sql = "select * from stu_teach_manage where mid=? and is_delete!=1";
  try {
    let result = await query(sql, mid);
    if (result.length !== 1) return res.cc("No such article");
    //2.更新文章内容
    sql = "update stu_teach_manage set ? where mid=?";
    result = await query(sql, pageinfo, mid);
    if (result.affectedRows !== 1) return res.cc("Failed to update article");
    //3.更新时间
    const editTime = sd.format(new Date(), "YYYY-MM-DD HH:mm");
    sql = "update stu_teach_manage set edit_time=? where mid=?";
    result = await query(sql, editTime, mid);
    if (result.affectedRows !== 1) return res.cc("Failed to update article");
    res.cc("Update article information successfully!", 0);
  } catch (error) {
    res.cc(error);
  }
};

/**
 * @api {post} /manage/getList Get list of articles by type
 * @apiDescription Get a list of academic management articles by type, and page them in descending order of last editing time (last edited at the top).
 * @apiName getManageList
 * @apiGroup studentManage
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer xx"
 *     }
 * @apiBody {int} type Article type, required, 1--Social Practice, 2--Extracurricular Activities, 3--Research Achievements
 * @apiBody {int} pageSize Number of data per page requested, required
 * @apiBody {iny} pageCurr Current page number, required

 * @apiExample {js} Request example:
 * {
      type:2,
      pageSize: 3,
      pageCurr: 1,
 * }
 * 
 * @apiSuccessExample {json} Response content:
{
    "status": 0,
    "message": "获取成功",
    "is_lastPage": false,
    "total": 3,
    "data_number": 3,
    "data": [
        {
            "mid": 20,
            "title": "title1",
            "edit_time": "2022-10-08 10:27",
            "author": "(*^_^*)"
        },
        {
            "mid": 10,
            "title": "title2",
            "edit_time": "2022-10-08 07:45",
            "author": "(*^_^*)"
        },
        {
            "mid": 11,
            "title": "title3",
            "edit_time": "2022-10-08 07:45",
            "author": "(*^_^*)"
        }
    ]
}
 * @apiVersion 1.0.0
 */
exports.getManageList = async (req, res) => {
  //要在此间形成分页
  let { type, pageSize, pageCurr } = req.body;
  const start = (pageCurr - 1) * pageSize; //起始位置

  try {
    let sql = "select * from stu_teach_manage where type=? and is_delete!=1";
    let result = await query(sql, type);
    let total = result.length;
    sql =
      "select mid,title,edit_time,author from stu_teach_manage where type=? and is_delete!=1 order by edit_time desc limit ?,? ";
    result = await query(sql, type, start, pageSize);

    let is_lastPage = result.length < pageSize ? true : false;
    res.send({
      status: 0,
      message: "获取成功",
      total,
      is_lastPage,
      data_number: result.length,
      data: result,
    });
  } catch (error) {
    res.cc(error);
  }
};
/**
 * @api {post} /manage/toBin Put articles in the recycle bin according to mid (Admin)
 * @apiDescription Put articles in the recycle bin according to mid
 * @apiName intoBin
 * @apiGroup studentManage
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiIyMDE5MDAzMDEwODIiLCJ1c2VybmFtZSI6ImRpbmd4aW55aSIsInBhc3N3b3JkIjoiIiwiZW1haWwiOiJkaW5neGlueWk2NjY2NjZAMTI2LmNvbSIsImF2YXRhciI6bnVsbCwicm9sZSI6MywidXBpZCI6IjciLCJpYXQiOjE2NjUxNzk3ODMsImV4cCI6NDY2NTI2NjE4M30.qD-lk84NHkE9ePaTcdlC_6n3Gi6B7P0CFNsxJt3jvKw"
 *     }
 * @apiBody {int} mid Article id, required

 * @apiExample {js} Request example:
 * {
        mid: 19
 * }
 * 
 * @apiSuccessExample {json} Response content:
{
    "status": 0,
    "message": "Delete successfully!"
}
 * @apiVersion 1.0.0
 */
exports.intoBin = async (req, res) => {
  //需要校验权限
  const { role } = req.user;
  if (role !== 3) return res.cc("You don't have permission");
  const { mid } = req.body;
  //1.查看有没有这篇id对应的文章
  let sql = "select * from stu_teach_manage where mid=? and is_delete!=1";
  try {
    let result = await query(sql, mid);
    if (result.length !== 1) return res.cc("No such article");
    //2.删除这篇文章
    sql = "update stu_teach_manage set is_delete=1 where mid=?";
    result = await query(sql, mid);
    if (result.affectedRows !== 1) return res.cc("Failed to delete");
    res.cc("Delete successfully!", 0);
  } catch (error) {
    res.cc(error);
  }
};
/**
 * @api {post} /manage/getPageDetails Get article details by mid
 * @apiDescription Get article details by mid, regardless of whether it is in the recycle bin
 * @apiName getPageDetails
 * @apiGroup studentManage
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiIyMDE5MDAzMDEwODIiLCJ1c2VybmFtZSI6ImRpbmd4aW55aSIsInBhc3N3b3JkIjoiIiwiZW1haWwiOiJkaW5neGlueWk2NjY2NjZAMTI2LmNvbSIsImF2YXRhciI6bnVsbCwicm9sZSI6MywidXBpZCI6IjciLCJpYXQiOjE2NjUxNzk3ODMsImV4cCI6NDY2NTI2NjE4M30.qD-lk84NHkE9ePaTcdlC_6n3Gi6B7P0CFNsxJt3jvKw"
 *     }
 * @apiBody {int} mid Article id, required

 * @apiExample {js} Request example:
 * {
        mid: 20
 * }
 * 
 * @apiSuccessExample {json} Response content:
{
    "status": 0,
    "message": "Get article details successfully!",
    "data": {
        "mid": 20,
        "uid": "201900301082",
        "type": 2,
        "title": "title1",
        "content": "content1",
        "create_time": "2022-10-08 10:26",
        "edit_time": "2022-10-08 10:27",
        "author": "(*^_^*)",
        "banner_pic": "https://sm.ms/image/8yBIwEGVKxNeadM",
        "is_delete": 0
    }
}
 * @apiVersion 1.0.0
 */
exports.getPageDetails = async (req, res) => {
  const { mid } = req.body;
  //获取文章详情,无论是否在回收站都能看
  let sql = "select * from stu_teach_manage where mid=?";
  try {
    let result = await query(sql, mid);
    if (result.length !== 1) return res.cc("The article does not exist");
    res.send({
      status: 0,
      message: "Get Article Details Success!",
      data: result[0],
    });
  } catch (error) {
    res.cc(error);
  }
};
/**
 * @api {post} /manage/getBinList Get Recycle Bin Article List(Admin)
 * @apiDescription Get the list of articles in the Academic Management Recycle Bin and page them in descending order according to the last editing time (the last edited ones are at the top).
 * @apiName getBinList
 * @apiGroup studentManage
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiIyMDE5MDAzMDEwODIiLCJ1c2VybmFtZSI6ImRpbmd4aW55aSIsInBhc3N3b3JkIjoiIiwiZW1haWwiOiJkaW5neGlueWk2NjY2NjZAMTI2LmNvbSIsImF2YXRhciI6bnVsbCwicm9sZSI6MywidXBpZCI6IjciLCJpYXQiOjE2NjUxNzk3ODMsImV4cCI6NDY2NTI2NjE4M30.qD-lk84NHkE9ePaTcdlC_6n3Gi6B7P0CFNsxJt3jvKw"
 *     }

 * @apiBody {int} pageSize How many pieces of data to request per page, required
 * @apiBody {iny} pageCurr How many pages are there now?

 * @apiExample {js} Example of a request:
 * {
      pageSize: 3,
      pageCurr: 1,
 * }
 * 
 * @apiSuccessExample {json} Back to content:
{
    "status": 0,
    "message": "Get Success",
    "is_lastPage": true,
    "total": 3,
    "data_number": 3,
    "data": [
        {
            "mid": 19,
            "title": "title1",
            "create_time": "2022-10-08 07:46",
            "edit_time": "2022-10-08 09:29",
            "author": "(*^_^*)",
            "type": 2
        },
        {
            "mid": 13,
            "title": "title2",
            "create_time": "2022-10-08 06:54",
            "edit_time": "2022-10-08 08:00",
            "author": "(*^_^*)",
            "type": 2
        },
        {
            "mid": 14,
            "title": "title3",
            "create_time": "2022-10-08 06:54",
            "edit_time": "2022-10-08 07:45",
            "author": "(*^_^*)",
            "type": 2
        }
    ]
}
 * @apiVersion 1.0.0
 */
exports.getBinList = async (req, res) => {
  //需要校验权限
  const { role } = req.user;
  if (role !== 3) return res.cc("You don't have permission");
  //要在此间形成分页
  let { pageSize, pageCurr } = req.body;
  const start = (pageCurr - 1) * pageSize; //起始位置

  try {
    let sql = "select * from stu_teach_manage where  is_delete=1";
    let result = await query(sql);
    let total = result.length;
    sql =
      "select mid,title,create_time,edit_time,author,type from stu_teach_manage where  is_delete=1 order by edit_time desc limit ?,? ";

    result = await query(sql, start, pageSize);

    let is_lastPage = result.length < pageSize ? true : false;
    res.send({
      status: 0,
      message: "Get Success",
      total,
      is_lastPage,
      data_number: result.length,
      data: result,
    });
  } catch (error) {
    res.cc(error);
  }
};
/**
 * @api {post} /manage/delete Delete articles in the Recycle Bin according to mid(Admin)
 * @apiDescription Delete articles in the Recycle Bin according to mid, must have administrator privileges
 * @apiName deletePage
 * @apiGroup studentManage
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiIyMDE5MDAzMDEwODIiLCJ1c2VybmFtZSI6ImRpbmd4aW55aSIsInBhc3N3b3JkIjoiIiwiZW1haWwiOiJkaW5neGlueWk2NjY2NjZAMTI2LmNvbSIsImF2YXRhciI6bnVsbCwicm9sZSI6MywidXBpZCI6IjciLCJpYXQiOjE2NjUxNzk3ODMsImV4cCI6NDY2NTI2NjE4M30.qD-lk84NHkE9ePaTcdlC_6n3Gi6B7P0CFNsxJt3jvKw"
 *     }
 * @apiBody {int} mid Article id, required
 * @apiExample {js} Request example:
 * {
        mid: 20
 * }
 * 
 * @apiSuccessExample {json} Response content:
{
    "status": 0,
    "message": "Delete successfully!"
}
 * @apiVersion 1.0.0
 */
exports.deletePage = async (req, res) => {
  //需要校验权限
  const { role } = req.user;
  if (role !== 3) return res.cc("You don't have permission");
  const { mid } = req.body;
  //获取文章详情,无论是否在回收站都能看
  let sql = "select * from stu_teach_manage where mid=? ";
  try {
    let result = await query(sql, mid);
    if (result.length !== 1) return res.cc("The article does not exist");
    if (result[0].is_delete !== 1)
      return res.cc("The article has not been added to the recycle bin");
    sql = "delete from stu_teach_manage where mid=?";
    result = await query(sql, mid);
    if (result.affectedRows !== 1) return res.cc("Failed to delete");
    res.cc("Delete successfully!", 0);
  } catch (error) {
    res.cc(error);
  }
};
