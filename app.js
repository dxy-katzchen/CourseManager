const express = require("express");
const cors = require("cors");
const joi = require("joi");

const { jwtSecretKey } = require("./config");
const { expressjwt } = require("express-jwt");
const app = express();

app.use(cors());

app.use(express.urlencoded({ extended: false }));

//Create a global middleware to optimize res.send
app.use((req, res, next) => {
  res.cc = (err, status = 1) => {
    res.send({
      status,
      message: err instanceof Error ? err.message : err,
    });
  };
  next();
});

app.use(
  expressjwt({
    secret: jwtSecretKey,
    algorithms: ["HS256"],
    requestProperty: "user",
  }).unless({
    path: [/^\/user\//],
  })
);
//Import user login module, no token verification required
const userRouter = require("./router/user");
app.use("/user", userRouter);
//Import user personal information module, need token verification
const userinfoRouter = require("./router/userinfo");
app.use("/my", userinfoRouter);
//Import personal homepage module, need token verification
const userpageRouter = require("./router/userpage");
app.use("/userpage", userpageRouter);

//Import engineering management module, need token verification
const manageRouter = require("./router/manage");
app.use("/manage", manageRouter);

//Import course module, need token authentication
const courseRouter = require("./router/course");
app.use("/course", courseRouter);

//Define error-level middleware at the back of all routes to catch errors.
app.use((err, req, res, next) => {
  //Format validation error
  if (err instanceof joi.ValidationError) return res.cc(err);
  if (err.name === "UnauthorizedError")
    return res.cc("Identity authentication failed!");
  //Unknown error
  res.cc(err);
});

app.listen(89, () => {
  console.log("Server running at http://127.0.0.1:89");
});
