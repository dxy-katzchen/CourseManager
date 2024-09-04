
//去除对象中为空字符串,undefined和null的属性,用于更新
exports.removeEmpty = (obj) => {
    Object.keys(obj).forEach(
      (key) =>
        (obj[key] == null || obj[key] == undefined || obj[key] === ""|| obj[key] === -1) &&
        delete obj[key]
    );

    return obj
  };