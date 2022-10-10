const joi = require("joi");

const cid = joi.number().integer().min(1);

const tid = joi.string().min(12).max(12);
const tname = joi.string().min(1).max(12);
const uid = joi.string().min(12).max(12).required();
//是否开放选课 0为未开放,1为开放
const is_open = joi.number().integer().min(0).max(1);
const cname = joi.string().min(1);
const credit = joi.number().integer().min(1);
const type = joi.number().integer().min(1).max(3);
//用来实现分页
const pageSize = joi.number().integer().min(1).required();
const pageCurr = joi.number().integer().min(1).required();

const ev_score = joi.number().integer().min(1).max(100).required();

exports.create_course_schema = {
  body: {
    tid: tid.required(),
    is_open: is_open.required(),
    cname: cname.required(),
    credit: credit.required(),
    type: type.required(),
  },
};

exports.update_course_schema = {
  body: {
    cid,
    is_open,
    cname,
    credit,
    type,
    tid,
  },
};

exports.get_course_list_schema = {
  body: {
    cname,
    cid,
    tname,
    is_open,
    type,
    pageSize,//必填
    pageCurr,//必填
  },
};

exports.delete_course_schema = {
  body: {
    cid: cid.required(),
  },
};

exports.stu_choose_course_schema = {
  body: {
    cid: cid.required(),
  },
};

exports.stu_evaluate_course_schema = {
  body: {
    ev_score,
    cid: cid.required(),
  },
};

exports.get_teacher_my_course_stu_schema = {
  body: {
    cid: cid.required(),
  },
};

exports.teacher_mark_stu_schema = {
  body: {
    stu_id: uid,
    cid: cid.required(),
    score: ev_score,
  },
};


