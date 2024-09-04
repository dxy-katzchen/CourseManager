const express = require("express");
const {
  getUserInfo,
  updateUserInfo,
  updatePassword,
} = require("../router_handler/userinfo");
const expressJoi = require("@escook/express-joi");
const { my_update_userinfo, my_update_password } = require("../schema/user");
const router = express.Router();

router.get("/userinfo", getUserInfo);

router.post("/userinfo", expressJoi(my_update_userinfo), updateUserInfo);

router.post("/updatepwd", expressJoi(my_update_password), updatePassword);

module.exports = router;
