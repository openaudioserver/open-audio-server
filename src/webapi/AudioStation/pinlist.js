const library = require('../../../library.js')

module.exports = {
  listPinnedItems,
  pinItem,
  unpinItem,
  renameItem,
  reorderPinnedItems,
  httpRequest: async (_, res, postData) => {
    let response
    switch (postData.method) {
      case 'list':
        response = await listPinnedItems()
        break
      case 'pin':
        response = await pinItem(postData)
        break
      case 'unpin':
        response = await unpinItem(postData)
        break
      case 'rename':
        response = await renameItem(postData)
        break
      case 'reorder':
        response = await reorderPinnedItems(postData)
        break
    }
    if (response) {
      return res.end(JSON.stringify(response))
    }
    res.statusCode = 404
    return res.end('{ "success": false }')
  }
}

async function listPinnedItems () {
  const response = {
    data: {
      items: library.pinList
    },
    success: true
  }
  return response
}

async function pinItem (options) {
  const items = JSON.parse(options.items)
  for (const item of items) {
    item.id = (library.pinList.length + 1).toString()
    item.name = item.genre || item.composer || item.artist || item.folder
    library.pinList.push(item)
  }
  library.rewritePins()
  return { success: true }
}

async function unpinItem (options) {
  const items = JSON.parse(options.items)
  for (const id of items) {
    const pin = library.pinList.filter(pin => pin.id === id)[0]
    library.pinList.splice(library.pinList.indexOf(pin), 1)
  }
  library.rewritePins()
  return { success: true }
}

async function renameItem (options) {
  const items = JSON.parse(options.items)
  for (const id of items) {
    const pin = library.pinList.filter(pin => pin.id === id)[0]
    pin.name = options.name
  }
  library.rewritePins()
  return { success: true }
}

async function reorderPinnedItems (options) {
  const newArray = []
  const newOrder = JSON.parse(options.items)
  for (const id of newOrder) {
    const pin = library.pinList.filter(pin => pin.id === id)[0]
    newArray.push(pin)
  }
  library.pinList.length = 0
  for (const pin of newArray) {
    pin.id = (library.pinList.length + 1).toString()
    library.pinList.push(pin)
  }
  return { success: true }
}
