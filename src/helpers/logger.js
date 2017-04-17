const log = (data) => {
  console.log('==============')
  data.forEach((item) => {
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
