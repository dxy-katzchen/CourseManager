
//拼接sql字符串
exports.concatSqlStr = function (sql, attrArray, queryInfo) {
  attrArray.forEach((currvar) => {
    if (currvar in queryInfo) {
      if (sql.split("=").length > sql.split("and").length) {
        sql += " and";
      }
      if (typeof queryInfo[currvar] === "string") {
        //如果是字符串类型的数据需要加单引号
        sql += " " + currvar + "=" + "'" + queryInfo[currvar] + "'";
      } else {
        sql += " " + currvar + "=" + queryInfo[currvar];
      }
    }
  });

  return sql;
};
