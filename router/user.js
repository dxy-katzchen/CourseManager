const express = require("express");
const expressJoi = require("@escook/express-joi");
const {
  register,
  login,
  sendEmail,
  varify,
  resetPwd,
} = require("../router_handler/user");
const {
  user_register_schema,
  lostpwd_varify_checkcode,
  login_uid_schema,
  lostpwd_send_email,
  lostpwd_reset_pwd,
} = require("../schema/user");

const router = express.Router();

router.post("/register", expressJoi(user_register_schema), register);

router.post("/login", expressJoi(login_uid_schema), login);

router.post("/lostPwd/sendEmail", expressJoi(lostpwd_send_email), sendEmail);

router.post("/lostPwd/varify", expressJoi(lostpwd_varify_checkcode), varify);

router.post("/lostPwd/resetPwd", expressJoi(lostpwd_reset_pwd), resetPwd);

module.exports = router;
