const library = require('../../../library.js')

module.exports = (req, res, postData, queryData) => {
  res.setHeader('content-type', 'application/javascript; charset="UTF-8"')
  if (postData.method === 'pin') {
    const items = JSON.parse(postData.items)
    for (const item of items) {
      item.id = (library.pinList.length + 1).toString()
      item.name = item.genre || item.composer || item.artist || item.folder
      library.pinList.push(item)
    }
    library.rewritePins()
  } else if (postData.method === 'reorder') {
    const newArray = []
    const newOrder = JSON.parse(postData.items)
    for (const id of newOrder) {
      const pin = library.pinList.filter(pin => pin.id === id)[0]
      newArray.push(pin)
    }
    library.pinList.length = 0
    for (const pin of newArray) {
      pin.id = (library.pinList.length + 1).toString()
      library.pinList.push(pin)
    }
  } else if (postData.method === 'rename') {
    const items = JSON.parse(postData.items)
    for (const id of items) {
      const pin = library.pinList.filter(pin => pin.id === id)[0]
      pin.name = postData.name
    }
    library.rewritePins()
  } else if (postData.method === 'unpin') {
    const items = JSON.parse(postData.items)
    for (const id of items) {
      const pin = library.pinList.filter(pin => pin.id === id)[0]
      library.pinList.splice(library.pinList.indexOf(pin), 1)
    }
    library.rewritePins()
  }
  const pinResponse = {
    data: {
      items: library.pinList
    },
    success: true
  }
  res.setHeader('content-type', 'application/javascript; charset="UTF-8"')
  return res.end(JSON.stringify(pinResponse))
}
