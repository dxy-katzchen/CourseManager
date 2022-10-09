const express = require("express");
const expressJoi = require("@escook/express-joi");
const { update_userpage_schema } = require("../schema/userpage");
const router = express.Router();
const {
  createUserpage,
  updateUserpage,
  getPageInfo
} = require("../router_handler/userpage");
//创建用户主页
router.post("/create", createUserpage);
//更新用户主页信息
router.post("/update", expressJoi(update_userpage_schema), updateUserpage);
//获取用户主页信息
router.get('/info',getPageInfo)

module.exports = router;
