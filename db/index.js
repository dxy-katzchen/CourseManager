const mysql = require("mysql2");

const db = mysql.createPool({
  // host: "localhost",
  // user: "sabina_remote",
  // password: "loveCat@2024",
  host: "localhost",
  user: "root",
  password: "20001123",

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
