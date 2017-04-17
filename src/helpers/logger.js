/* @flow */

const log = (data: Array<any>) => {
  console.log('==============')
  data.forEach((item: string | { [any]: any }) => {
    let line
    if (typeof item === 'object') {
      line = JSON.stringify(item, null, 2)
    } else {
      line = item
    }
    console.log(line)
  })
  console.log('==============')
}

export { log as default }
