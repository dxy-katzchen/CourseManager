const { query } = require("../db");
//时间格式化
const sd = require("silly-datetime");
/**
 * @api {post} /manage/create 创建文章(Admin)
 * @apiDescription 创建学工管理公告，什么都不用发
 * @apiName createManagePage
 * @apiGroup studentManage
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiIyMDE5MDAzMDEwODIiLCJ1c2VybmFtZSI6ImRpbmd4aW55aSIsInBhc3N3b3JkIjoiIiwiZW1haWwiOiJkaW5neGlueWk2NjY2NjZAMTI2LmNvbSIsImF2YXRhciI6bnVsbCwicm9sZSI6MywidXBpZCI6IjciLCJpYXQiOjE2NjUxNzk3ODMsImV4cCI6NDY2NTI2NjE4M30.qD-lk84NHkE9ePaTcdlC_6n3Gi6B7P0CFNsxJt3jvKw"
 *     }
 * @apiSuccessExample {json} 返回内容:
{
    "status": 1,
    "message": {
        "status": 0,
        "message": "创建公告成功",
        "mid": 6
    }
}
 * @apiVersion 1.0.0
 */
exports.createManagePage = async (req, res) => {
  //需要校验权限
  const { role, uid } = req.user;
  if (role !== 3) return res.cc("您没有权限");
  //对Date对象进行格式化
  const createTime = sd.format(new Date(), "YYYY-MM-DD HH:mm");
  let sql = "insert into stu_teach_manage set uid=? , create_time=?";
  try {
    let result = await query(sql, uid, createTime);
    if (result.affectedRows !== 1) return res.cc("创建公告失败");
    const mid = result.insertId;
    res.cc({
      status: 0,
      message: "创建公告成功",
      mid,
    });
  } catch (error) {
    res.cc(error);
  }
};
/**
 * @api {post} /manage/update 更新文章信息(Admin)
 * @apiDescription 更新学工管理文章信息
 * @apiName updateManagePage
 * @apiGroup studentManage
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiIyMDE5MDAzMDEwODIiLCJ1c2VybmFtZSI6ImRpbmd4aW55aSIsInBhc3N3b3JkIjoiIiwiZW1haWwiOiJkaW5neGlueWk2NjY2NjZAMTI2LmNvbSIsImF2YXRhciI6bnVsbCwicm9sZSI6MywidXBpZCI6IjciLCJpYXQiOjE2NjUxNzk3ODMsImV4cCI6NDY2NTI2NjE4M30.qD-lk84NHkE9ePaTcdlC_6n3Gi6B7P0CFNsxJt3jvKw"
 *     }
 * @apiBody {int} mid 文章id,必填
 * @apiBody {int} type 文章类型,1--社会实践,2--课外活动,3--研究成果,选填
 * @apiBody {string} title 题目,选填
 * @apiBody {string} content 内容,选填
 * @apiBody {string} author 作者,选填
 * @apiBody {string} banner_pic 照片地址,选填
 * @apiExample {js} 请求示例:
 * {
        mid: 19
        type: 2
        banner_pic: "https://sm.ms/image/8yBIwEGVKxNeadM"
        author: "(*^_^*)"
        title: "山东大学学生种树"
        content: "山东大学学生开展种树活动,非常好"
 * }
 * 
 * @apiSuccessExample {json} 返回内容:
{
    "status": 0,
    "message": "更新文章信息成功!"
}
 * @apiVersion 1.0.0
 */
exports.updateManagePage = async (req, res) => {
  //需要校验权限
  const { role } = req.user;
  if (role !== 3) return res.cc("您没有权限");
  const { mid, ...pageinfo } = req.body;
  //1.查看有没有这篇id对应的文章
  let sql = "select * from stu_teach_manage where mid=? and is_delete!=1";
  try {
    let result = await query(sql, mid);
    if (result.length !== 1) return res.cc("没有这篇文章");
    //2.更新文章内容
    sql = "update stu_teach_manage set ? where mid=?";
    result = await query(sql, pageinfo, mid);
    if (result.affectedRows !== 1) return res.cc("更新文章失败");
    //3.更新时间
    const editTime = sd.format(new Date(), "YYYY-MM-DD HH:mm");
    sql = "update stu_teach_manage set edit_time=? where mid=?";
    result = await query(sql, editTime, mid);
    if (result.affectedRows !== 1) return res.cc("更新文章失败");
    res.cc("更新文章信息成功!", 0);
  } catch (error) {
    res.cc(error);
  }
};

/**
 * @api {get} /manage/getList 根据类型获取文章列表
 * @apiDescription 根据类型获取学工管理文章列表,并按照最后编辑时间降序分页(最后编辑的在顶部)
 * @apiName getManageList
 * @apiGroup studentManage
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiIyMDE5MDAzMDEwODIiLCJ1c2VybmFtZSI6ImRpbmd4aW55aSIsInBhc3N3b3JkIjoiIiwiZW1haWwiOiJkaW5neGlueWk2NjY2NjZAMTI2LmNvbSIsImF2YXRhciI6bnVsbCwicm9sZSI6MywidXBpZCI6IjciLCJpYXQiOjE2NjUxNzk3ODMsImV4cCI6NDY2NTI2NjE4M30.qD-lk84NHkE9ePaTcdlC_6n3Gi6B7P0CFNsxJt3jvKw"
 *     }

 * @apiBody {int} type 文章类型,1--社会实践,2--课外活动,3--研究成果,必填
 * @apiBody {int} pageSize 一页请求多少条数据,必填
 * @apiBody {iny} pageCurr 现在是多少页,必填

 * @apiExample {js} 请求示例:
 * {
      type:2,
      pageSize: 3,
      pageCurr: 1,
 * }
 * 
 * @apiSuccessExample {json} 返回内容:
{
    "status": 0,
    "message": "获取成功",
    "is_lastPage": false,
    "data_number": 3,
    "data": [
        {
            "mid": 20,
            "title": "山东大学学生种树",
            "edit_time": "2022-10-08 10:27",
            "author": "(*^_^*)"
        },
        {
            "mid": 10,
            "title": "山东大学学生种树",
            "edit_time": "2022-10-08 07:45",
            "author": "(*^_^*)"
        },
        {
            "mid": 11,
            "title": "山东大学学生种树",
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
  let sql =
    "select mid,title,edit_time,author from stu_teach_manage where type=? and is_delete!=1 order by edit_time desc limit ?,? ";

  try {
    let result = await query(sql, type, start, pageSize);

    let is_lastPage = result.length < pageSize ? true : false;
    res.send({
      status: 0,
      message: "获取成功",
      is_lastPage,
      data_number: result.length,
      data: result,
    });
  } catch (error) {
    res.cc(error);
  }
};
/**
 * @api {post} /manage/toBin 根据mid将文章放入回收站(Admin)
 * @apiDescription 根据mid将文章放入回收站
 * @apiName intoBin
 * @apiGroup studentManage
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiIyMDE5MDAzMDEwODIiLCJ1c2VybmFtZSI6ImRpbmd4aW55aSIsInBhc3N3b3JkIjoiIiwiZW1haWwiOiJkaW5neGlueWk2NjY2NjZAMTI2LmNvbSIsImF2YXRhciI6bnVsbCwicm9sZSI6MywidXBpZCI6IjciLCJpYXQiOjE2NjUxNzk3ODMsImV4cCI6NDY2NTI2NjE4M30.qD-lk84NHkE9ePaTcdlC_6n3Gi6B7P0CFNsxJt3jvKw"
 *     }
 * @apiBody {int} mid 文章id,必填

 * @apiExample {js} 请求示例:
 * {
        mid: 19
 * }
 * 
 * @apiSuccessExample {json} 返回内容:
{
    "status": 0,
    "message": "删除成功!"
}
 * @apiVersion 1.0.0
 */
exports.intoBin = async (req, res) => {
  //需要校验权限
  const { role } = req.user;
  if (role !== 3) return res.cc("您没有权限");
  const { mid } = req.body;
  //1.查看有没有这篇id对应的文章
  let sql = "select * from stu_teach_manage where mid=? and is_delete!=1";
  try {
    let result = await query(sql, mid);
    if (result.length !== 1) return res.cc("没有这篇文章");
    //2.删除这篇文章
    sql = "update stu_teach_manage set is_delete=1 where mid=?";
    result = await query(sql, mid);
    if (result.affectedRows !== 1) return res.cc("删除失败");
    res.cc("删除成功!", 0);
  } catch (error) {
    res.cc(error);
  }
};
/**
 * @api {get} /manage/getPageDetails 根据mid获取文章详情
 * @apiDescription 根据mid获取文章详情,无论有没有放入回收站都能看
 * @apiName getPageDetails
 * @apiGroup studentManage
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiIyMDE5MDAzMDEwODIiLCJ1c2VybmFtZSI6ImRpbmd4aW55aSIsInBhc3N3b3JkIjoiIiwiZW1haWwiOiJkaW5neGlueWk2NjY2NjZAMTI2LmNvbSIsImF2YXRhciI6bnVsbCwicm9sZSI6MywidXBpZCI6IjciLCJpYXQiOjE2NjUxNzk3ODMsImV4cCI6NDY2NTI2NjE4M30.qD-lk84NHkE9ePaTcdlC_6n3Gi6B7P0CFNsxJt3jvKw"
 *     }
 * @apiBody {int} mid 文章id,必填

 * @apiExample {js} 请求示例:
 * {
        mid: 20
 * }
 * 
 * @apiSuccessExample {json} 返回内容:
{
    "status": 0,
    "message": "获取文章详情成功!",
    "data": {
        "mid": 20,
        "uid": "201900301082",
        "type": 2,
        "title": "山东大学学生种树",
        "content": "山东大学学生开展种树活动,非常好",
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
    if (result.length !== 1) return res.cc("该文章不存在");
    res.send({
      status: 0,
      message: "获取文章详情成功!",
      data: result[0],
    });
  } catch (error) {
    res.cc(error);
  }
};
/**
 * @api {get} /manage/getBinList 获取回收站文章列表(Admin)
 * @apiDescription 获取学工管理回收站文章列表,并按照最后编辑时间降序分页(最后编辑的在顶部)
 * @apiName getBinList
 * @apiGroup studentManage
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiIyMDE5MDAzMDEwODIiLCJ1c2VybmFtZSI6ImRpbmd4aW55aSIsInBhc3N3b3JkIjoiIiwiZW1haWwiOiJkaW5neGlueWk2NjY2NjZAMTI2LmNvbSIsImF2YXRhciI6bnVsbCwicm9sZSI6MywidXBpZCI6IjciLCJpYXQiOjE2NjUxNzk3ODMsImV4cCI6NDY2NTI2NjE4M30.qD-lk84NHkE9ePaTcdlC_6n3Gi6B7P0CFNsxJt3jvKw"
 *     }

 * @apiBody {int} pageSize 一页请求多少条数据,必填
 * @apiBody {iny} pageCurr 现在是多少页,必填

 * @apiExample {js} 请求示例:
 * {
      pageSize: 3,
      pageCurr: 1,
 * }
 * 
 * @apiSuccessExample {json} 返回内容:
{
    "status": 0,
    "message": "获取成功",
    "is_lastPage": true,
    "data_number": 3,
    "data": [
        {
            "mid": 19,
            "title": "山东大学学生种树",
            "create_time": "2022-10-08 07:46",
            "edit_time": "2022-10-08 09:29",
            "author": "(*^_^*)",
            "type": 2
        },
        {
            "mid": 13,
            "title": "山东大学学生种树",
            "create_time": "2022-10-08 06:54",
            "edit_time": "2022-10-08 08:00",
            "author": "(*^_^*)",
            "type": 2
        },
        {
            "mid": 14,
            "title": "山东大学学生种树",
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
  if (role !== 3) return res.cc("您没有权限");
  //要在此间形成分页
  let { pageSize, pageCurr } = req.body;
  const start = (pageCurr - 1) * pageSize; //起始位置
  let sql =
    "select mid,title,create_time,edit_time,author,type from stu_teach_manage where  is_delete=1 order by edit_time desc limit ?,? ";

  try {
    let result = await query(sql, start, pageSize);

    let is_lastPage = result.length < pageSize ? true : false;
    res.send({
      status: 0,
      message: "获取成功",
      is_lastPage,
      data_number: result.length,
      data: result,
    });
  } catch (error) {
    res.cc(error);
  }
};
/**
 * @api {post} /manage/delete 根据mid删除回收站内的文章(Admin)
 * @apiDescription 根据mid删除回收站内的文章,必须有管理员权限
 * @apiName deletePage
 * @apiGroup studentManage
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiIyMDE5MDAzMDEwODIiLCJ1c2VybmFtZSI6ImRpbmd4aW55aSIsInBhc3N3b3JkIjoiIiwiZW1haWwiOiJkaW5neGlueWk2NjY2NjZAMTI2LmNvbSIsImF2YXRhciI6bnVsbCwicm9sZSI6MywidXBpZCI6IjciLCJpYXQiOjE2NjUxNzk3ODMsImV4cCI6NDY2NTI2NjE4M30.qD-lk84NHkE9ePaTcdlC_6n3Gi6B7P0CFNsxJt3jvKw"
 *     }
 * @apiBody {int} mid 文章id,必填
 * @apiExample {js} 请求示例:
 * {
        mid: 20
 * }
 * 
 * @apiSuccessExample {json} 返回内容:
{
    "status": 0,
    "message": "删除成功"
}
 * @apiVersion 1.0.0
 */
exports.deletePage = async (req, res) => {
  //需要校验权限
  const { role } = req.user;
  if (role !== 3) return res.cc("您没有权限");
  const { mid } = req.body;
  //获取文章详情,无论是否在回收站都能看
  let sql = "select * from stu_teach_manage where mid=? ";
  try {
    let result = await query(sql, mid);
    if (result.length !== 1) return res.cc("该文章不存在");
    if (result[0].is_delete !== 1) return res.cc("该文章还未加入回收站");
    sql = "delete from stu_teach_manage where mid=?";
    result = await query(sql, mid);
    if (result.affectedRows !== 1) return res.cc("删除失败");
    res.cc("删除成功",0);
  } catch (error) {
    res.cc(error);
  }
};
