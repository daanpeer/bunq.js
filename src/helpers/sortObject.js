/* @flow */

const sortObject = (object: { [string]: string }): { [string]: string } => {
  const sortedObject: { [string]: string } = {}
  Object.keys(object)
    .sort()
    .forEach((key) => {
      sortedObject[key] = object[key]
    })
  return sortedObject
}

module.exports = sortObject
