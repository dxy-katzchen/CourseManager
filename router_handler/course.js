const { query } = require("../db");

const { removeEmpty } = require("../utils/removeEmpty");
const { concatSqlStr } = require("../utils/concatSqlStr");
/**
 * @api {post} /course/create Create a course(Admin)
 * @apiDescription Create a course
 * @apiName createCourse
 * @apiGroup Course
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiIyMDE5MDAzMDEwODIiLCJ1c2VybmFtZSI6ImRpbmd4aW55aSIsInBhc3N3b3JkIjoiIiwiZW1haWwiOiJkaW5neGlueWk2NjY2NjZAMTI2LmNvbSIsImF2YXRhciI6bnVsbCwicm9sZSI6MywidXBpZCI6IjciLCJpYXQiOjE2NjUxNzk3ODMsImV4cCI6NDY2NTI2NjE4M30.qD-lk84NHkE9ePaTcdlC_6n3Gi6B7P0CFNsxJt3jvKw"
 *     }
 * @apiBody {number=0,1} is_open Whether to open the course selection, 0 means not open, 1 means open, required
 * @apiBody {string} cname Course name, required
 * @apiBody {number{1..}} credit Course credit must be an integer greater than 1, required
 * @apiBody {number{1..3}} type Course type, 1--必修课,2--限选课,3--选修课, required
 * @apiBody {string} tid Teacher's job number, required
 * @apiExample {js} Request example:
 * {
 *    is_open: 0,
 *    cname: "Database course design",
 *    credit: 2,
 * }
 * @apiSuccessExample {json} Return content:
{
    "status": 0,
    "message": "Course added successfully!",
    "cid": 3
}
 * @apiVersion 1.0.0
 */
exports.createCourse = async (req, res) => {
  const { role } = req.user;
  if (role !== 3) return res.cc("You don't have permission");
  const { tid, ...courseInfo } = req.body;

  try {
    //查询有无该教师
    let sql = "select * from users where uid=? and role=2";
    let result = await query(sql, tid);
    if (result.length !== 1) return res.cc("Teacher information error!");
    req.body.tname = result[0].username;
    sql = "insert into course set ?";
    result = await query(sql, req.body);
    if (result.affectedRows !== 1) return res.cc("Failed to add course");
    let cid = result.insertId;
    res.send({
      status: 0,
      message: "Course added successfully!",
      cid,
    });
  } catch (error) {
    res.cc(error);
  }
};

/**
 * @api {post} /course/update Admin updates course information(Admin)
 * @apiDescription Admin updates course information(Admin), can be used for list update, because single attribute update is allowed
 * @apiName updateCourse
 * @apiGroup Course
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiIyMDE5MDAzMDEwODIiLCJ1c2VybmFtZSI6ImRpbmd4aW55aSIsInBhc3N3b3JkIjoiIiwiZW1haWwiOiJkaW5neGlueWk2NjY2NjZAMTI2LmNvbSIsImF2YXRhciI6bnVsbCwicm9sZSI6MywidXBpZCI6IjciLCJpYXQiOjE2NjUxNzk3ODMsImV4cCI6NDY2NTI2NjE4M30.qD-lk84NHkE9ePaTcdlC_6n3Gi6B7P0CFNsxJt3jvKw"
 *     }
 * @apiBody {number} cid Course id, required
 * @apiBody {number=0,1} is_open Whether to open the course selection, 0 means not open, 1 means open, optional
 * @apiBody {string} cname Course name, optional
 * @apiBody {number{1..}} credit Course credit must be an integer greater than 1, optional
 * @apiBody {number{1..3}} type Course type, 1 - Compulsory courses, 2 - Restricted courses, 3 - Elective courses, optional
 * @apiBody {string} tid Teacher's job number, optional
 * @apiExample {js} Request example:
 * {
 *    cid:1,
 *    is_open: 0,
 *    cname: "Database course design",
 *    credit: 2,
 * }
 * @apiSuccessExample {json} Return content:
{
    "status": 0,
    "message": "Update course information successfully!"
}
 * @apiVersion 1.0.0
 */
exports.updateCourse = async (req, res) => {
  const { role } = req.user;
  if (role !== 3) return res.cc("You don't have permission");
  let { cid, ...courseInfo } = req.body;

  try {
    //过滤为空字符串,null和undefined的属性
    courseInfo = removeEmpty(courseInfo);
    if (JSON.stringify(courseInfo) == "{}") return res.cc("You didn't update");
    //1.检查是否有该门课程
    let sql = "select * from course where cid=?";
    let result = await query(sql, cid);
    if (result.length !== 1) return res.cc("No such course");
    //2.检查是否有此id教师,有则查教师是否存在,并且向对象插入 教师姓名 属性
    if (courseInfo.hasOwnProperty("tid")) {
      let { tid, ...otherInfo } = courseInfo;
      sql = "select * from users where uid=? and role=2";
      result = await query(sql, tid);
      if (result.length !== 1) return res.send("Teacher information error!");
      courseInfo.tname = result[0].username;
    }
    //3.更新课程信息
    sql = "update course set ? where cid=?";
    result = await query(sql, courseInfo, cid);
    if (result.affectedRows !== 1)
      return res.cc("Failed to update course information");
    res.cc("Update course information successfully!", 0);
  } catch (error) {
    res.cc(error);
  }
};

/**
 * @api {post} /course/getCourseList Get a list of courses by type(common)
 * @apiDescription Query the public information of the course by conditions (common), can be based on cname, tname, cid, is_open filtering, no pass is all
 * @apiName getCourseList
 * @apiGroup Course
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiIyMDE5MDAzMDEwODIiLCJ1c2VybmFtZSI6ImRpbmd4aW55aSIsInBhc3N3b3JkIjoiIiwiZW1haWwiOiJkaW5neGlueWk2NjY2NjZAMTI2LmNvbSIsImF2YXRhciI6bnVsbCwicm9sZSI6MywidXBpZCI6IjciLCJpYXQiOjE2NjUxNzk3ODMsImV4cCI6NDY2NTI2NjE4M30.qD-lk84NHkE9ePaTcdlC_6n3Gi6B7P0CFNsxJt3jvKw"
 *     }
 * @apiBody {int} pageSize How many pieces of data to request per page, required
 * @apiBody {int} pageCurr currnet page, required
 * @apiBody {int} type Course type, 1--Compulsory courses, 2--Restricted courses, 3--Elective courses, optional
 * @apiBody {string} tname Teacher's name, optional
 * @apiBody {string} cname Course name, optional
 * @apiBody {int} is_open Whether to open the course selection, 0 means not open, 1 means open, optional
 * @apiBody {int} cid Course id, optional

 * @apiExample {js} Request example:
 * {
      cid: 2,
      cname: "physics",
      is_open: 1,
      tname: "teacher1",
      type: 1,
      pageSize: 10,
      pageCurr: 1,
 * }
 * 
 * @apiSuccessExample {json} Return content:
{
    "status": 0,
    "message": "Successfully retrieved course information",
    "data": [
        {
            "cid": 2,
            "is_open": 1,
            "cname": "physics",
            "credit": 10,
            "type": 1,
            "tid": "201900301086",
            "tname": "teacher1"
        }
    ]
}
 * @apiVersion 1.0.0
 */
exports.getCourseList = async (req, res) => {
  let sql = "select * from course";
  const { role } = req.user;
  let { pageSize, pageCurr, ...queryInfo } = req.body;
  const start = (pageCurr - 1) * pageSize; //起始位置

  try {
    let result = await query(sql);
    let total = result.length;
    //过滤为空字符串,null和undefined和-1的属性
    queryInfo = removeEmpty(queryInfo);

    if (JSON.stringify(queryInfo) !== "{}") {
      sql += " where";

      let attrArr = ["cname", "tname", "cid", "is_open", "type"];
      //难点,亮点,动态拼接sql字符串
      sql = await concatSqlStr(sql, attrArr, queryInfo);
      result = await query(sql);
      total = result.length;
    }

    //分页处理
    sql += " limit " + start + "," + pageSize;
    result = await query(sql);

    res.send({
      status: 0,
      message: "Successfully retrieved course information",
      total,
      data: result,
    });
  } catch (error) {
    res.cc(error);
  }
};

/**
 * @api {post} /course/delete Delete a course by cid(Admin)
 * @apiDescription Delete a course by cid, must have admin permission
 * @apiName deleteCourse
 * @apiGroup Course
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiIyMDE5MDAzMDEwODIiLCJ1c2VybmFtZSI6ImRpbmd4aW55aSIsInBhc3N3b3JkIjoiIiwiZW1haWwiOiJkaW5neGlueWk2NjY2NjZAMTI2LmNvbSIsImF2YXRhciI6bnVsbCwicm9sZSI6MywidXBpZCI6IjciLCJpYXQiOjE2NjUxNzk3ODMsImV4cCI6NDY2NTI2NjE4M30.qD-lk84NHkE9ePaTcdlC_6n3Gi6B7P0CFNsxJt3jvKw"
 *     }
 * @apiBody {int} cid course id,required
 * @apiExample {js} Request example:
 * {
        cid: 20
 * }
 * 
 * @apiSuccessExample {json} Return content:
{
    "status": 0,
    "message": "Delete successfully!"
}
 * @apiVersion 1.0.0
 */
exports.deleteCourse = async (req, res) => {
  const { role } = req.user;
  if (role !== 3) return res.cc("You don't have permission");
  const { cid } = req.body;
  let sql = "select * from course where cid=?";
  try {
    let result = await query(sql, cid);
    if (result.length !== 1) return res.cc("No such course");
    sql = "delete from course where cid=?";
    result = await query(sql, cid);
    if (result.affectedRows !== 1) return res.cc("Failed to delete");
    res.cc("Delete successfully!", 0);
  } catch (error) {
    res.cc(error);
  }
};
/**
 * @api {post} /course/student/getMyCourse Get the course list I selected(Stu)
 * @apiDescription Get the course list I selected(Stu)
 * @apiName stuGetMyCourseList
 * @apiGroup CourseStudent
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiIyMDE5MDAzMDEwODIiLCJ1c2VybmFtZSI6ImRpbmd4aW55aSIsInBhc3N3b3JkIjoiIiwiZW1haWwiOiJkaW5neGlueWk2NjY2NjZAMTI2LmNvbSIsImF2YXRhciI6bnVsbCwicm9sZSI6MywidXBpZCI6IjciLCJpYXQiOjE2NjUxNzk3ODMsImV4cCI6NDY2NTI2NjE4M30.qD-lk84NHkE9ePaTcdlC_6n3Gi6B7P0CFNsxJt3jvKw"
 *     }
  *@apiBody {int} pageSize How many pieces of data to request per page, required
 * @apiBody {int} pageCurr currnet page, required
 * @apiExample {js} Request example:
 * {
      pageSize: 10,
      pageCurr: 1,
 * }
 * @apiSuccessExample {json} Return content:
{
    "status": 0,
    "total": 2,
    "message": "Successfully retrieved your course list!",
    "data": [
     
        {
            "cid": 33,
            "ev_score": null,
            "stu_score": null,
            "is_open": 1,
            "cname": "是",
            "credit": 1,
            "type": 2,
            "tname": "Teacher2"
        },
        {
            "cid": 34,
            "ev_score": null,
            "stu_score": null,
            "is_open": 1,
            "cname": "2",
            "credit": 2,
            "type": 1,
            "tname": "Teacher2"
        }
    ]
}
 * @apiVersion 1.0.0
 */
exports.stuGetMyCourseList = async (req, res) => {
  const { uid, role } = req.user;
  const { pageSize, pageCurr } = req.body;
  const start = (pageCurr - 1) * pageSize; //起始位置
  if (role !== 1) return res.cc("You don't have student permission");
  let sql =
    "select cid,ev_score,stu_score,is_open,cname,credit,type,tname from stu_choose_course inner join course using(cid) where uid=" +
    uid;
  try {
    let result = await query(sql, uid);
    const total = result.length;
    sql += " limit " + start + "," + pageSize;

    result = await query(sql);
    res.send({
      status: 0,
      total,
      message: "Successfully retrieved your course list!",
      data: result,
    });
  } catch (error) {
    res.cc(error);
  }
};
/**
 * @api {post} /course/student/choose Student chooses a course based on cid(Stu)
 * @apiDescription Student chooses a course based on cid(Stu)
 * @apiName stuChooseCourse
 * @apiGroup CourseStudent
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiIyMDE5MDAzMDEwODIiLCJ1c2VybmFtZSI6ImRpbmd4aW55aSIsInBhc3N3b3JkIjoiIiwiZW1haWwiOiJkaW5neGlueWk2NjY2NjZAMTI2LmNvbSIsImF2YXRhciI6bnVsbCwicm9sZSI6MywidXBpZCI6IjciLCJpYXQiOjE2NjUxNzk3ODMsImV4cCI6NDY2NTI2NjE4M30.qD-lk84NHkE9ePaTcdlC_6n3Gi6B7P0CFNsxJt3jvKw"
 *     }
 * @apiBody {int} cid Course id, required
 * @apiExample {js} Request example:
 * {
        cid: 2
 * }
 * 
 * @apiSuccessExample {json} Return content:
{
    "status": 0,
    "message": "Course selection successful"
}
 * @apiVersion 1.0.0
 */
exports.stuChooseCourse = async (req, res) => {
  const { uid, role } = req.user;
  if (role !== 1) return res.cc("You don't have permission");
  const { cid } = req.body;
  try {
    //检查课程是否存在或者已经结束选课
    let sql = "select * from course where cid=?";
    let result = await query(sql, cid);
    if (result.length !== 1) return res.cc("Course does not exist");
    if (result[0].is_open == 0) return res.cc("The course has ended");
    //检查是否重复选课
    sql = "select * from stu_choose_course where uid=? and cid=?";
    result = await query(sql, uid, cid);
    if (result.length === 1)
      return res.cc("You can't choose the same course twice!");
    //拿到学生用户名
    sql = "select * from users where uid=?";
    result = await query(sql, uid);
    if (result.length !== 1) return res.cc("Failed to choose the course");
    let stu_name = result[0].username;
    //添加选课
    sql = "insert into stu_choose_course set uid=?,cid=?,stu_name=?";
    result = await query(sql, uid, cid, stu_name);
    if (result.affectedRows !== 1) return res.cc("Failed to choose the course");
    res.cc("Course selection successful", 0);
  } catch (error) {
    res.cc(error);
  }
};
/**
 * @api {post} /course/student/withdraw Students withdraw from classes based on cid(Stu)
 * @apiDescription Students withdraw from classes based on cid(Stu)
 * @apiName stuWithdraw
 * @apiGroup CourseStudent
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiIyMDE5MDAzMDEwODIiLCJ1c2VybmFtZSI6ImRpbmd4aW55aSIsInBhc3N3b3JkIjoiIiwiZW1haWwiOiJkaW5neGlueWk2NjY2NjZAMTI2LmNvbSIsImF2YXRhciI6bnVsbCwicm9sZSI6MywidXBpZCI6IjciLCJpYXQiOjE2NjUxNzk3ODMsImV4cCI6NDY2NTI2NjE4M30.qD-lk84NHkE9ePaTcdlC_6n3Gi6B7P0CFNsxJt3jvKw"
 *     }
 * @apiBody {int} cid Course id, required
 * @apiExample {js} Request example:
 * {
        cid: 2
 * }
 * 
 * @apiSuccessExample {json} Return content:
{
    "status": 0,
    "message": "Course withdrawal successful"
}
 * @apiVersion 1.0.0
 */
exports.stuWithdraw = async (req, res) => {
  const { uid, role } = req.user;
  if (role !== 1) return res.cc("You don't have permission");
  const { cid } = req.body;
  try {
    //检查课程是否存在或者已经结束选课
    let sql = "select * from course where cid=?";
    let result = await query(sql, cid);
    if (result.length !== 1) return res.cc("Course does not exist");
    if (result[0].is_open == 0) return res.cc("The course has ended");

    //退课
    sql = "delete from stu_choose_course where cid=? and uid=?";
    result = await query(sql, cid, uid);
    if (result.affectedRows !== 1)
      return res.cc("Failed to withdraw from the course");
    res.cc("Course withdrawal successful", 0);
  } catch (error) {
    res.cc(error);
  }
};
/**
 * @api {post} /course/student/evaluate  Student evaluates the course based on cid(Stu)
 * @apiDescription Student evaluates the course based on cid(Stu)
 * @apiName stuEvaluateCourse
 * @apiGroup CourseStudent
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiIyMDE5MDAzMDEwODIiLCJ1c2VybmFtZSI6ImRpbmd4aW55aSIsInBhc3N3b3JkIjoiIiwiZW1haWwiOiJkaW5neGlueWk2NjY2NjZAMTI2LmNvbSIsImF2YXRhciI6bnVsbCwicm9sZSI6MywidXBpZCI6IjciLCJpYXQiOjE2NjUxNzk3ODMsImV4cCI6NDY2NTI2NjE4M30.qD-lk84NHkE9ePaTcdlC_6n3Gi6B7P0CFNsxJt3jvKw"
 *     }
 * @apiBody {int} cid Course id, required
 * @apiBody {int{1...100}} ev_score  Student's score for the course, can be 1-100, required
 * @apiExample {js} Request example:
 * {
        cid: 2,
        ev_score:69
 * }
 * 
 * @apiSuccessExample {json} Return content:
{
    "status": 0,
    "message": "Evaluation successful"
}
 * @apiVersion 1.0.0
 */
exports.stuEvaluateCourse = async (req, res) => {
  /** 
Student evaluation: Student evaluates the course based on cid
Must be executed when the course is_open field is 0, i.e., when the course selection has ended
The person performing the operation must be a student
*/

  //1.学生身份校验
  const { uid, role } = req.user;
  if (role !== 1) return res.cc("You don't have permission");
  const { cid, ev_score } = req.body;
  try {
    //2.查看该课程是否存在或尚在选课阶段
    let sql = "select * from course where cid=?";
    let result = await query(sql, cid);
    if (result.length !== 1) return res.cc("The course does not exist");
    if (result[0].is_open == 1)
      return res.cc(
        "The course is still in the selection phase, you cannot score"
      );
    //3.查询该学生有没有选择这门课程
    sql = "select * from stu_choose_course where uid=? and cid=?";
    result = await query(sql, uid, cid);
    if (result.length !== 1) return res.cc("You haven't chosen this course");
    sql = "update stu_choose_course set ev_score=? where uid=? and cid=?";
    result = await query(sql, ev_score, uid, cid);
    if (result.affectedRows !== 1) return res.cc("Failed to score");
    res.cc("Evaluation successful", 0);
  } catch (error) {
    res.cc(error);
  }
};
/**
 * @api {post} /course/teacher/mark Rate my students.(Teacher)
 * @apiDescription Rate my students.(Teacher)
 * @apiName teacherMarkStu
 * @apiGroup CourseTeacher
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiIyMDE5MDAzMDEwODIiLCJ1c2VybmFtZSI6ImRpbmd4aW55aSIsInBhc3N3b3JkIjoiIiwiZW1haWwiOiJkaW5neGlueWk2NjY2NjZAMTI2LmNvbSIsImF2YXRhciI6bnVsbCwicm9sZSI6MywidXBpZCI6IjciLCJpYXQiOjE2NjUxNzk3ODMsImV4cCI6NDY2NTI2NjE4M30.qD-lk84NHkE9ePaTcdlC_6n3Gi6B7P0CFNsxJt3jvKw"
 *     }
 * @apiBody {int} cid Course id, required
 * @apiBody {string} stu_id Student id, required
 * @apiBody {int} score Score, 1-100, required
 * 
 * @apiExample {js} Request example:
 * {
        cid: 2,
        stu_id:"201900301083",
        score:100
 * }
 * 
 * @apiSuccessExample {json} Return content:
{
    "status": 1,
    "message": "Evaluation successful"
}
 * @apiVersion 1.0.0
 */
//老师给学生打分
exports.teacherMarkStu = async (req, res) => {
  //1.校验老师权限
  const { uid, role } = req.user;
  if (role !== 2) return res.cc("You don't have teacher permission");
  //获取学生id,课程id
  const { stu_id, cid, score } = req.body;
  //检验这门课是不是这位老师代课,或者课程是否在选课阶段
  let sql = "select * from course where cid=?";
  try {
    let result = await query(sql, cid);
    if (result.length !== 1) return res.cc("Course does not exist");
    if (result[0].tid !== uid)
      return res.cc("You are not the teacher of this course");
    if (result[0].is_open === 1)
      return res.cc(
        "The course is still in the selection phase, you cannot score"
      );
    //老师给学生打分
    sql = "update stu_choose_course set stu_score=? where uid=? and cid=?";
    result = await query(sql, score, stu_id, cid);
    if (result.affectedRows !== 1) return res.cc("Failed to score");
    res.cc("Evaluation successful", 0);
  } catch (error) {
    res.cc(error);
  }
};

/**
 * @api {post} /course/teacher/getCourseStuList Get my student list(Teacher)
 * @apiDescription Get my student list(Teacher)
 * @apiName getCourseStuList
 * @apiGroup CourseTeacher
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiIyMDE5MDAzMDEwODIiLCJ1c2VybmFtZSI6ImRpbmd4aW55aSIsInBhc3N3b3JkIjoiIiwiZW1haWwiOiJkaW5neGlueWk2NjY2NjZAMTI2LmNvbSIsImF2YXRhciI6bnVsbCwicm9sZSI6MywidXBpZCI6IjciLCJpYXQiOjE2NjUxNzk3ODMsImV4cCI6NDY2NTI2NjE4M30.qD-lk84NHkE9ePaTcdlC_6n3Gi6B7P0CFNsxJt3jvKw"
 *     }
 * @apiBody {int} cid Course id, required
 * @apiExample {js} Request example:
 * {
        cid: 2,
 * }
 * 
 * @apiSuccessExample {json} Return content:
{
    "status": 0,
    "message": "Get successfully",
    "data": [
        {
            "uid": "201900301083",
            "cid": 18,
            "ev_score": null,
            "stu_score": null,
            "stu_name": "Student username"
        }
    ]
}
 * @apiVersion 1.0.0
 */
//老师获取他教的一门课程的所有学生列表
exports.getCourseStuList = async (req, res) => {
  //1.身份校验
  const { uid, role } = req.user;
  if (role !== 2) return res.cc("You don't have teacher permission");
  //2.验证这门课是不是这个老师教的,如果不是,没有权利查看学生列表
  const { cid } = req.body;
  let sql = "select * from course where cid=? and tid=?";
  try {
    let result = await query(sql, cid, uid);
    if (result.length !== 1)
      return res.cc("The course does not exist or the teacher is not you");
    //3.获取选择这门课的所有学生列表
    sql = "select * from stu_choose_course where cid=?";
    result = await query(sql, cid);
    res.send({
      status: 0,
      message: "Get successfully",
      data: result,
    });
  } catch (error) {
    res.cc(error);
  }
};
/**
 * @api {post} /course/teacher/getTeacherCourseList Get my course list(Teacher)
 * @apiDescription Get my course list(Teacher)
 * @apiName getTeacherCourseList
 * @apiGroup CourseTeacher
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiIyMDE5MDAzMDEwODIiLCJ1c2VybmFtZSI6ImRpbmd4aW55aSIsInBhc3N3b3JkIjoiIiwiZW1haWwiOiJkaW5neGlueWk2NjY2NjZAMTI2LmNvbSIsImF2YXRhciI6bnVsbCwicm9sZSI6MywidXBpZCI6IjciLCJpYXQiOjE2NjUxNzk3ODMsImV4cCI6NDY2NTI2NjE4M30.qD-lk84NHkE9ePaTcdlC_6n3Gi6B7P0CFNsxJt3jvKw"
 *     }
 * @apiBody {int} pageSize How many data to request per page, required
 * @apiBody {int} pageCurr What page are you on, required
 * @apiExample {js} Request example:
 * {
      pageSize: 10,
      pageCurr: 1,
 * }
 * @apiSuccessExample {json} Return content:
{
    "status": 0,
    "total": 3,
    "message": "Getting Your Class List Succeeded!",
    "data": [
        {
            "cid": 13,
            "is_open": 0,
            "cname": "Database",
            "credit": 2,
            "type": 1,
            "tid": "201900301088",
            "tname": "dxyxy"
        },
        {
            "cid": 14,
            "is_open": 0,
            "cname": "Database",
            "credit": 2,
            "type": 1,
            "tid": "201900301088",
            "tname": "dxyxy"
        },
        {
            "cid": 15,
            "is_open": 0,
            "cname": "Database",
            "credit": 2,
            "type": 1,
            "tid": "201900301088",
            "tname": "dxyxy"
        },
     
    ]
}
 * @apiVersion 1.0.0
 */
exports.getTeacherCourseList = async (req, res) => {
  const { uid, role } = req.user;
  const { pageSize, pageCurr } = req.body;

  const start = (pageCurr - 1) * pageSize;
  if (role !== 2) return res.cc("You don't have teacher permission");
  let sql = "select * from course where tid= " + uid;
  try {
    let result = await query(sql);
    const total = result.length;
    sql += " limit " + start + "," + pageSize;
    result = await query(sql);
    res.send({
      status: 0,
      total,
      message: "Get Your Class List Succeeded!",
      data: result,
    });
  } catch (error) {
    res.cc(error);
  }
};
