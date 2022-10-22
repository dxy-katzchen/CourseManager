const express = require("express");

const router = express.Router();
const expressJoi = require("@escook/express-joi");
const {
  createManagePage,
  updateManagePage,
  getManageList,
  intoBin,
  getPageDetails,
  getBinList,
  deletePage
} = require("../router_handler/manage");
const {
  update_manage_schema,
  get_list_schema,
  get_page_schema,
  get_bin_list,
} = require("../schema/manage");

//按照类型获取学工管理列表
router.post("/getList", expressJoi(get_list_schema), getManageList);
//根据id获取文章详情,是否在回收站都能获取
router.post("/getPageDetails", expressJoi(get_page_schema), getPageDetails);
//创建学工管理文章(Admin)
router.post("/create", createManagePage);
//更新学工管理文章(Admin)
router.post("/update", expressJoi(update_manage_schema), updateManagePage);
//根据id删除学工管理文章,加入回收站(Admin)
router.post("/toBin", expressJoi(get_page_schema), intoBin);
//获取在回收站的文章列表(Admin)
router.get("/getBinList", expressJoi(get_bin_list), getBinList);
//删除文章(Admin)
router.post('/delete', expressJoi(get_page_schema),deletePage)

module.exports = router;
