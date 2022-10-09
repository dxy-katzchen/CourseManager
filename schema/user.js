const joi = require("joi");

const username = joi.string().min(1).max(12).required();
const uid = joi.string().min(12).max(12).required();
const email = joi.string().email().required();
const password = joi.string().alphanum().min(6).max(12).required();
const role = joi.number().integer().min(1).max(3);
const checkCode = joi
  .string()
  .pattern(/[0-9]{6}/)
  .required();
const avatar = joi.string();

//验证规则对象--用户注册
exports.user_register_schema = {
  body: {
    username,
    uid,
    email,
    password,
    role,
  },
};

//验证规则对象--uid登录
exports.login_uid_schema = {
  body: {
    uid,
    password,
  },
};

//验证规则对象--发送邮箱
exports.lostpwd_send_email = {
  body: {
    email,
  },
};
//验证规则对象--验证码,邮箱
exports.lostpwd_varify_checkcode = {
  body: {
    email,
    checkCode,
  },
};
//验证规则对象--密码,邮箱
exports.lostpwd_reset_pwd = {
  body: {
    email,
    password,
    passwordRepeat: joi.ref("password"),
  },
};
//验证规则对象--更新基本信息
exports.my_update_userinfo = {
  body: {
    username,
    email,
    avatar, //可选

  },
};
//验证规则对象--更新密码
exports.my_update_password={
body:{
  oldPwd:password,
  newPwd:joi.not(joi.ref('oldPwd')).concat(password)
}
}