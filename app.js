const express = require("express");
const cors = require("cors");
const joi = require("joi");
const expressJWT = require("express-jwt");
const { jwtSecretKey } = require("./config");
const app = express();

app.use(cors());

app.use(express.urlencoded({ extended: false }));

//创建优化res.send的全局中间件
app.use((req, res, next) => {
  res.cc = (err, status = 1) => {
    res.send({
      status,
      message: err instanceof Error ? err.message : err,
    });
  };
  next();
});

app.use(expressJWT({ secret: jwtSecretKey }).unless({ path: [/^\/user\//] }));
//导入用户登录模块,不需要token验证
const userRouter = require("./router/user");
app.use("/user", userRouter);
//导入用户个人信息模块,需要token验证
const userinfoRouter = require("./router/userinfo");
app.use("/my", userinfoRouter);
//导入个人主页模块,需要token验证
const userpageRouter = require("./router/userpage");
app.use("/userpage", userpageRouter);

//导入学工管理模块,需要token验证
const manageRouter = require("./router/manage");
app.use("/manage", manageRouter);

//导入课程模块,需要token验证
const courseRouter = require("./router/course");
app.use("/course", courseRouter);

//在所有路由的后方定义错误级别的中间件,对错误进行捕获
app.use( (err, req, res, next) => {
  //格式验证错误
  if (err instanceof joi.ValidationError) return res.cc(err);
  if (err.name === "UnauthorizedError") return res.cc("身份认证失败!");
  //未知错误
 res.cc(err);
});

app.listen(1111, () => {
  console.log("express服务器运行在http://127.0.0.1:1111");
});
