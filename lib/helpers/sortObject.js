const sortObject = object => {
  const sortedObject = {};
  Object.keys(object).sort().forEach(key => {
    sortedObject[key] = object[key];
  });
  return sortedObject;
};

module.exports = sortObject;