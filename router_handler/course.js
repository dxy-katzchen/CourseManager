const { result } = require("@hapi/joi/lib/base");
const { type } = require("express/lib/response");
const res = require("express/lib/response");
const { query } = require("../db");

const { removeEmpty } = require("../utils/removeEmpty");

/**
 * @api {post} /course/create 管理员创建课程(Admin)
 * @apiDescription 管理员创建课程
 * @apiName createCourse
 * @apiGroup Course
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiIyMDE5MDAzMDEwODIiLCJ1c2VybmFtZSI6ImRpbmd4aW55aSIsInBhc3N3b3JkIjoiIiwiZW1haWwiOiJkaW5neGlueWk2NjY2NjZAMTI2LmNvbSIsImF2YXRhciI6bnVsbCwicm9sZSI6MywidXBpZCI6IjciLCJpYXQiOjE2NjUxNzk3ODMsImV4cCI6NDY2NTI2NjE4M30.qD-lk84NHkE9ePaTcdlC_6n3Gi6B7P0CFNsxJt3jvKw"
 *     }
 * @apiBody {number=0,1} is_open 是否开放选课,0表示未开放,1表示开放,必填
 * @apiBody {string} cname 课程名称,必填
 * @apiBody {number{1..}} credit 课程学分 必须是大于1的整数,必填
 * @apiBody {number{1..3}} type 课程类型 1--必修课,2--限选课,3--选修课,必填
 * @apiBody {string} tid 任课老师工号,必填
 * @apiExample {js} 请求示例:
 * {
 *    is_open: 0,
 *    cname: "数据库课程设计",
 *    credit: 2,
 * }
 * @apiSuccessExample {json} 返回内容:
{
    "status": 0,
    "message": "添加课程成功!",
    "cid": 3
}
 * @apiVersion 1.0.0
 */
exports.createCourse = async (req, res) => {
  const { role } = req.user;
  if (role !== 3) return res.cc("您没有权限");
  const { tid, ...courseInfo } = req.body;

  try {
    //查询有无该教师
    let sql = "select * from users where uid=? and role=2";
    let result = await query(sql, tid);
    if (result.length !== 1) return res.send("任课教师信息错误!");
    req.body.tname = result[0].username;
    sql = "insert into course set ?";
    result = await query(sql, req.body);
    if (result.affectedRows !== 1) return res.cc("添加课程失败");
    let cid = result.insertId;
    res.send({
      status: 0,
      message: "添加课程成功!",
      cid,
    });
  } catch (error) {
    res.cc(error);
  }
};

/**
 * @api {post} /course/update 管理员更新课程信息(Admin)
 * @apiDescription 管理员更新课程信息(Admin),可以用作列表更新,因为可以更新单个属性
 * @apiName updateCourse
 * @apiGroup Course
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiIyMDE5MDAzMDEwODIiLCJ1c2VybmFtZSI6ImRpbmd4aW55aSIsInBhc3N3b3JkIjoiIiwiZW1haWwiOiJkaW5neGlueWk2NjY2NjZAMTI2LmNvbSIsImF2YXRhciI6bnVsbCwicm9sZSI6MywidXBpZCI6IjciLCJpYXQiOjE2NjUxNzk3ODMsImV4cCI6NDY2NTI2NjE4M30.qD-lk84NHkE9ePaTcdlC_6n3Gi6B7P0CFNsxJt3jvKw"
 *     }
 * @apiBody {number} cid 课程id,必填
 * @apiBody {number=0,1} is_open 是否开放选课,0表示未开放,1表示开放,选填
 * @apiBody {string} cname 课程名称,选填
 * @apiBody {number{1..}} credit 课程学分 必须是大于1的整数,选填
 * @apiBody {number{1..3}} type 课程类型 1--必修课,2--限选课,3--选修课,选填
 * @apiBody {string} tid 任课老师工号,选填
 * @apiExample {js} 请求示例:
 * {
 *    cid:1,
 *    is_open: 0,
 *    cname: "数据库课程设计",
 *    credit: 2,
 * }
 * @apiSuccessExample {json} 返回内容:
{
    "status": 0,
    "message": "更新课程信息成功!"
}
 * @apiVersion 1.0.0
 */
exports.updateCourse = async (req, res) => {
  const { role } = req.user;
  if (role !== 3) return res.cc("您没有权限");
  let { cid, ...courseInfo } = req.body;

  try {
    //过滤为空字符串,null和undefined的属性
    courseInfo = removeEmpty(courseInfo);
    if (JSON.stringify(courseInfo) == "{}") return res.cc("您没有更新");
    //1.检查是否有该门课程
    let sql = "select * from course where cid=?";
    let result = await query(sql, cid);
    if (result.length !== 1) return res.cc("没有这门课程");
    //2.检查是否有此id教师,有则查教师是否存在,并且向对象插入 教师姓名 属性
    if (courseInfo.hasOwnProperty("tid")) {
      let { tid, ...otherInfo } = courseInfo;
      sql = "select * from users where uid=? and role=2";
      result = await query(sql, tid);
      if (result.length !== 1) return res.send("任课教师信息错误!");
      courseInfo.tname = result[0].username;
    }
    //3.更新课程信息
    sql = "update course set ? where cid=?";
    result = await query(sql, courseInfo, cid);
    if (result.affectedRows !== 1) return res.cc("更新课程信息失败");
    res.cc("更新课程信息成功!", 0);
  } catch (error) {
    res.cc(error);
  }
};
//按条件查询课程的公开信息(common),可以根据cname,tname,cid,is_open筛选,没传就是全部

/**
 * @api {get} /course/getCourseList 根据类型获取课程列表(common)
 * @apiDescription 按条件查询课程的公开信息(common),可以根据cname,tname,cid,is_open筛选,没传就是全部
 * @apiName getCourseList
 * @apiGroup Course
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiIyMDE5MDAzMDEwODIiLCJ1c2VybmFtZSI6ImRpbmd4aW55aSIsInBhc3N3b3JkIjoiIiwiZW1haWwiOiJkaW5neGlueWk2NjY2NjZAMTI2LmNvbSIsImF2YXRhciI6bnVsbCwicm9sZSI6MywidXBpZCI6IjciLCJpYXQiOjE2NjUxNzk3ODMsImV4cCI6NDY2NTI2NjE4M30.qD-lk84NHkE9ePaTcdlC_6n3Gi6B7P0CFNsxJt3jvKw"
 *     }
 * @apiBody {int} pageSize 一页请求多少条数据,必填
 * @apiBody {int} pageCurr 现在是多少页,必填
 * @apiBody {int} type 课程类型,1--必修,2--限选,3--选修,选填
 * @apiBody {string} tname 教师名称,选填
 * @apiBody {string} cname 课程名称,选填
 * @apiBody {int} is_open 是否开放,0--未开放选课,1--开放选课,选填
 * @apiBody {int} cid 课程id,选填

 * @apiExample {js} 请求示例:
 * {
      cid: 2,
      cname: "大学物理",
      is_open: 1,
      tname: "教师1",
      type: 1,
      pageSize: 10,
      pageCurr: 1,
 * }
 * 
 * @apiSuccessExample {json} 返回内容:
{
    "status": 0,
    "message": "成功获取课程信息",
    "data": [
        {
            "cid": 2,
            "is_open": 1,
            "cname": "大学物理",
            "credit": 10,
            "type": 1,
            "tid": "201900301086",
            "tname": "教师1"
        }
    ]
}
 * @apiVersion 1.0.0
 */
exports.getCourseList = async (req, res) => {
  let sql = "select * from course";
  const { pageSize, pageCurr, ...queryInfo } = req.body;
  const start = (pageCurr - 1) * pageSize; //起始位置
  try {
    let result = await query(sql);
    if (JSON.stringify(queryInfo) == "{}")
      return res.send({
        status: 0,
        message: "成功获取所有课程信息",
        data: result,
      });
    sql += " where";
    let obj = { sql };
    //难点,亮点,动态拼接sql字符串
    obj.addSql = function (currvar) {
      if (currvar in queryInfo) {
        if (this.sql.split("=").length > this.sql.split("and").length) {
          this.sql += " and";
        }
        if (typeof queryInfo[currvar] === "string") {
          //如果是字符串类型的数据需要加单引号
          this.sql += " " + currvar + "=" + "'" + queryInfo[currvar] + "'";
        } else {
          this.sql += " " + currvar + "=" + queryInfo[currvar];
        }
      }
      return obj;
    };

    obj
      .addSql("cname")
      .addSql("tname")
      .addSql("cid")
      .addSql("is_open")
      .addSql("type");
    sql = obj.sql;
    sql += " limit " + start + "," + pageSize;

    result = await query(sql);

    res.send({
      status: 0,
      message: "成功获取课程信息",
      data: result,
      
    });
  } catch (error) {
    res.cc(error);
  }
};

/**
 * @api {post} /course/delete 根据cid删除课程(Admin)
 * @apiDescription 根据cid删除课程,必须有管理员权限
 * @apiName deleteCourse
 * @apiGroup Course
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiIyMDE5MDAzMDEwODIiLCJ1c2VybmFtZSI6ImRpbmd4aW55aSIsInBhc3N3b3JkIjoiIiwiZW1haWwiOiJkaW5neGlueWk2NjY2NjZAMTI2LmNvbSIsImF2YXRhciI6bnVsbCwicm9sZSI6MywidXBpZCI6IjciLCJpYXQiOjE2NjUxNzk3ODMsImV4cCI6NDY2NTI2NjE4M30.qD-lk84NHkE9ePaTcdlC_6n3Gi6B7P0CFNsxJt3jvKw"
 *     }
 * @apiBody {int} cid 课程id,必填
 * @apiExample {js} 请求示例:
 * {
        cid: 20
 * }
 * 
 * @apiSuccessExample {json} 返回内容:
{
    "status": 0,
    "message": "删除成功"
}
 * @apiVersion 1.0.0
 */
exports.deleteCourse = async (req, res) => {
  const { role } = req.user;
  if (role !== 3) return res.cc("您没有权限");
  const { cid } = req.body;
  let sql = "select * from course where cid=?";
  try {
    let result = await query(sql, cid);
    if (result.length !== 1) return res.cc("没有这门课程");
    sql = "delete from course where cid=?";
    result = await query(sql, cid);
    if (result.affectedRows !== 1) return res.cc("删除失败");
    res.cc("删除成功!", 0);
  } catch (error) {
    res.cc(error);
  }
};

/**
 * @api {post} /course/student/choose 学生根据cid选课(Stu)
 * @apiDescription 学生根据cid选课(Stu)
 * @apiName stuChooseCourse
 * @apiGroup CourseStudent
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiIyMDE5MDAzMDEwODIiLCJ1c2VybmFtZSI6ImRpbmd4aW55aSIsInBhc3N3b3JkIjoiIiwiZW1haWwiOiJkaW5neGlueWk2NjY2NjZAMTI2LmNvbSIsImF2YXRhciI6bnVsbCwicm9sZSI6MywidXBpZCI6IjciLCJpYXQiOjE2NjUxNzk3ODMsImV4cCI6NDY2NTI2NjE4M30.qD-lk84NHkE9ePaTcdlC_6n3Gi6B7P0CFNsxJt3jvKw"
 *     }
 * @apiBody {int} cid 课程id,必填
 * @apiExample {js} 请求示例:
 * {
        cid: 2
 * }
 * 
 * @apiSuccessExample {json} 返回内容:
{
    "status": 0,
    "message": "选课成功"
}
 * @apiVersion 1.0.0
 */
exports.stuChooseCourse = async (req, res) => {
  const { uid, role } = req.user;
  if (role !== 1) return res.cc("没有权限");
  const { cid } = req.body;
  try {
    //检查课程是否存在或者已经结束选课
    let sql = "select * from course where cid=?";
    let result = await query(sql, cid);
    if (result.length !== 1) return res.cc("课程不存在");
    if (result[0].is_open == 0) return res.cc("该课程已经结束选课");
    //检查是否重复选课
    sql = "select * from stu_choose_course where uid=? and cid=?";
    result = await query(sql, uid, cid);
    if (result.length === 1) return res.cc("不能重复选课!");
    //拿到学生用户名
    sql = "select * from users where uid=?";
    result = await query(sql, uid);
    if (result.length !== 1) return res.cc("选课失败");
    let stu_name = result[0].username;
    //添加选课
    sql = "insert into stu_choose_course set uid=?,cid=?,stu_name=?";
    result = await query(sql, uid, cid, stu_name);
    if (result.affectedRows !== 1) return res.cc("选课失败");
    res.cc("选课成功", 0);
  } catch (error) {
    res.cc(error);
  }
};

/**
 * @api {post} /course/student/evaluste 学生给这门课程打分(Stu)
 * @apiDescription 学生给这门课程打分
 * @apiName stuEvaluateCourse
 * @apiGroup CourseStudent
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiIyMDE5MDAzMDEwODIiLCJ1c2VybmFtZSI6ImRpbmd4aW55aSIsInBhc3N3b3JkIjoiIiwiZW1haWwiOiJkaW5neGlueWk2NjY2NjZAMTI2LmNvbSIsImF2YXRhciI6bnVsbCwicm9sZSI6MywidXBpZCI6IjciLCJpYXQiOjE2NjUxNzk3ODMsImV4cCI6NDY2NTI2NjE4M30.qD-lk84NHkE9ePaTcdlC_6n3Gi6B7P0CFNsxJt3jvKw"
 *     }
 * @apiBody {int} cid 课程id,必填
 * @apiBody {int{1...100}} ev_score 学生给该课程打的分数,可以打1-100分,必填
 * @apiExample {js} 请求示例:
 * {
        cid: 2,
        ev_score:69
 * }
 * 
 * @apiSuccessExample {json} 返回内容:
{
    "status": 0,
    "message": "打分成功"
}
 * @apiVersion 1.0.0
 */
exports.stuEvaluateCourse = async (req, res) => {
  /** 
学生互评:学生给这门课程打分
必须在课程is_open字段为0时,即选课已关闭时才能执行该操作
执行操作的人必须是学生
*/

  //1.学生身份校验
  const { uid, role } = req.user;
  if (role !== 1) return res.cc("没有权限");
  const { cid, ev_score } = req.body;
  try {
    //2.查看该课程是否存在或尚在选课阶段
    let sql = "select * from course where cid=?";
    let result = await query(sql, cid);
    if (result.length !== 1) return res.cc("该课程不存在");
    if (result[0].is_open == 1) return res.cc("该课程尚在选课阶段,您不能评分");
    //3.查询该学生有没有选择这门课程
    sql = "select * from stu_choose_course where uid=? and cid=?";
    result = await query(sql, uid, cid);
    if (result.length !== 1) return res.cc("您没有选择该门课程");
    sql = "update stu_choose_course set ev_score=? where uid=? and cid=?";
    result = await query(sql, ev_score, uid, cid);
    if (result.affectedRows !== 1) return res.cc("打分失败");
    res.cc("打分成功", 0);
  } catch (error) {
    res.cc(error);
  }
};
/**
 * @api {post} /course/teacher/mark 给我的学生打分(Teacher)
 * @apiDescription 给我的学生打某课程的分(Teacher)
 * @apiName teacherMarkStu
 * @apiGroup CourseTeacher
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiIyMDE5MDAzMDEwODIiLCJ1c2VybmFtZSI6ImRpbmd4aW55aSIsInBhc3N3b3JkIjoiIiwiZW1haWwiOiJkaW5neGlueWk2NjY2NjZAMTI2LmNvbSIsImF2YXRhciI6bnVsbCwicm9sZSI6MywidXBpZCI6IjciLCJpYXQiOjE2NjUxNzk3ODMsImV4cCI6NDY2NTI2NjE4M30.qD-lk84NHkE9ePaTcdlC_6n3Gi6B7P0CFNsxJt3jvKw"
 *     }
 * @apiBody {int} cid 课程id,必填
 * @apiBody {string} stu_id 学生学号,必填
 * @apiBody {int} score 老师给学生的分数,1-100之间的整数,必填
 * 
 * @apiExample {js} 请求示例:
 * {
        cid: 2,
        stu_id:"201900301083",
        score:100
 * }
 * 
 * @apiSuccessExample {json} 返回内容:
{
    "status": 1,
    "message": "打分成功"
}
 * @apiVersion 1.0.0
 */
//老师给学生打分
exports.teacherMarkStu = async (req, res) => {
  //1.校验老师权限
  const { uid, role } = req.user;
  if (role !== 2) return res.cc("您没有教师权限");
  //获取学生id,课程id
  const { stu_id, cid, score } = req.body;
  //检验这门课是不是这位老师代课,或者课程是否在选课阶段
  let sql = "select * from course where cid=?";
  try {
    let result = await query(sql, cid);
    if (result.length !== 1) return res.cc("课程不存在");
    if (result[0].tid !== uid) return res.cc("您不是代课老师,没有权限打分");
    if (result[0].is_open === 1)
      return res.cc("该课程尚在选课阶段,老师不能打分");
    //老师给学生打分
    sql = "update stu_choose_course set stu_score=? where uid=? and cid=?";
    result = await query(sql, score, stu_id, cid);
    if (result.affectedRows !== 1) return res.cc("打分失败");
    res.cc("打分成功");
  } catch (error) {
    res.cc(error);
  }
};

/**
 * @api {post} /course/teacher/getCourseStuList 获取我的学生列表(Teacher)
 * @apiDescription 根据cid获取我教的课程的学生列表(Teacher)
 * @apiName getCourseStuList
 * @apiGroup CourseTeacher
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiIyMDE5MDAzMDEwODIiLCJ1c2VybmFtZSI6ImRpbmd4aW55aSIsInBhc3N3b3JkIjoiIiwiZW1haWwiOiJkaW5neGlueWk2NjY2NjZAMTI2LmNvbSIsImF2YXRhciI6bnVsbCwicm9sZSI6MywidXBpZCI6IjciLCJpYXQiOjE2NjUxNzk3ODMsImV4cCI6NDY2NTI2NjE4M30.qD-lk84NHkE9ePaTcdlC_6n3Gi6B7P0CFNsxJt3jvKw"
 *     }
 * @apiBody {int} cid 课程id,必填
 * @apiExample {js} 请求示例:
 * {
        cid: 2,
        ev_score:69
 * }
 * 
 * @apiSuccessExample {json} 返回内容:
{
    "status": 0,
    "message": "获取成功",
    "data": [
        {
            "uid": "201900301083",
            "cid": 18,
            "ev_score": null,
            "stu_score": null,
            "stu_name": "学生用户名"
        }
    ]
}
 * @apiVersion 1.0.0
 */
//老师获取他教的一门课程的所有学生列表
exports.getCourseStuList = async (req, res) => {
  //1.身份校验
  const { uid, role } = req.user;
  if (role !== 2) return res.cc("您没有教师权限");
  //2.验证这门课是不是这个老师教的,如果不是,没有权利查看学生列表
  const { cid } = req.body;
  let sql = "select * from course where cid=? and tid=?";
  try {
    let result = await query(sql, cid, uid);
    if (result.length !== 1) return res.cc("此课程不存在或授课老师不是您");
    //3.获取选择这门课的所有学生列表
    sql = "select * from stu_choose_course where cid=?";
    result = await query(sql, cid);
    res.send({
      status: 0,
      message: "获取成功",
      data: result,
    });
  } catch (error) {
    res.cc(error);
  }
};
/**
 * @api {post} /course/teacher/getMyCourseList 获取我教的课程列表(Teacher)
 * @apiDescription 获取我教的课程列表(Teacher)
 * @apiName getMyCourseList
 * @apiGroup CourseTeacher
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiIyMDE5MDAzMDEwODIiLCJ1c2VybmFtZSI6ImRpbmd4aW55aSIsInBhc3N3b3JkIjoiIiwiZW1haWwiOiJkaW5neGlueWk2NjY2NjZAMTI2LmNvbSIsImF2YXRhciI6bnVsbCwicm9sZSI6MywidXBpZCI6IjciLCJpYXQiOjE2NjUxNzk3ODMsImV4cCI6NDY2NTI2NjE4M30.qD-lk84NHkE9ePaTcdlC_6n3Gi6B7P0CFNsxJt3jvKw"
 *     }

 * @apiSuccessExample {json} 返回内容:
{
    "status": 0,
    "length": 3,
    "message": "获取您的教课列表成功!",
    "data": [
        {
            "cid": 13,
            "is_open": 0,
            "cname": "数据库课程设计",
            "credit": 2,
            "type": 1,
            "tid": "201900301088",
            "tname": "dxyxy"
        },
        {
            "cid": 14,
            "is_open": 0,
            "cname": "数据库课程设计",
            "credit": 2,
            "type": 1,
            "tid": "201900301088",
            "tname": "dxyxy"
        },
        {
            "cid": 15,
            "is_open": 0,
            "cname": "数据库课程设计",
            "credit": 2,
            "type": 1,
            "tid": "201900301088",
            "tname": "dxyxy"
        },
     
    ]
}
 * @apiVersion 1.0.0
 */
exports.getMyCourseList = async (req, res) => {
  const { uid, role } = req.user;
  if (role !== 2) return res.cc("您没有教师权限");
  let sql = "select * from course where tid=?";
  try {
    let result = await query(sql, uid);
    res.send({
      status: 0,
      length: result.length,
      message: "获取您的教课列表成功!",
      data: result,
    });
  } catch (error) {
    res.cc(error);
  }
};

