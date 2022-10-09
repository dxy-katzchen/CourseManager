const joi = require("joi");

/**
 * 文章类型
 * 1--社会实践
 * 2--课外活动
 * 3--研究成果
 */
const type = joi.number().integer().min(1).max(3);
const title = joi.string();
const content = joi.string();
// const create_time = joi.string();
// const edit_time = joi.string();
const author = joi.string();
const banner_pic = joi.string();
const mid = joi.number().integer().min(1).required();
//用来实现分页
const pageSize = joi.number().integer().min(1).required();
const pageCurr = joi.number().integer().min(1).required();

exports.update_manage_schema = {
  body: {
    mid,
    type,
    title,
    content,
    author,
    banner_pic,
  },
};
exports.get_list_schema = {
  body: {
    type: joi.required().concat(type),
    pageSize,
    pageCurr,
  },
};
exports.get_page_schema = {
  body: {
    mid,
  },
};
exports.get_bin_list = {
  body: {
    pageSize,
    pageCurr,
  },
};
