const joi = require("joi");

const upid = joi.number().integer().required();

const comment = joi.string().min(1);
const photo = joi.string();
const book = joi.string();
const search = joi.string();
const teachcourse = joi.string();
const blog = joi.string();

//验证规则对象--更新用户主页
exports.update_userpage_schema = {
  body: {
    upid,
    comment,
    photo,
    blog,
    search,
    book,
    teachcourse,
  },
};
