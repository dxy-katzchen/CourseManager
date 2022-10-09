const express = require("express");

const router = express.Router();
const expressJoi = require("@escook/express-joi");
const {
  create_course_schema,
  update_course_schema,
  get_course_list_schema,
  delete_course_schema,
  stu_choose_course_schema,
  stu_evaluate_course_schema,
} = require("../schema/course");
const {
  createCourse,
  updateCourse,
  getCourseList,
  deleteCourse,
  stuChooseCourse,
  stuEvaluateCourse,
} = require("../router_handler/course");
//管理员对课程的CRUD
router.post("/create", expressJoi(create_course_schema), createCourse);
router.post("/update", expressJoi(update_course_schema), updateCourse);
router.get("/getCourseList", expressJoi(get_course_list_schema), getCourseList);
router.post("/delete", expressJoi(delete_course_schema), deleteCourse);
//学生选课
router.post(
  "/student/choose",
  expressJoi(stu_choose_course_schema),
  stuChooseCourse
);
//学生互评
router.post(
  "/student/evaluate",
  expressJoi(stu_evaluate_course_schema),
  stuEvaluateCourse
);
//老师给学生打分
// router.post(
//   '/teacher/mark',


// )

//老师,管理员获取选择该门课程的所有学生列表




module.exports = router;
