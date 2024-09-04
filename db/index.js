const res = require("express/lib/response");
const mysql = require("mysql");

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "20001123",
  //服务器
  // password: "123456",
  database: "course_manager",
});

// select * from  i=? and b=?
const query = (sql, ...valueArgs) =>
  new Promise((resove, reject) => {
    const values = valueArgs.flat();
    db.query(sql, values, (err, result) => {
      if (err) {
        reject(err);
      }
      resove(result);
    });
  });

module.exports = {
  query,
};
