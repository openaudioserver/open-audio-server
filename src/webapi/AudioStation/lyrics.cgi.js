module.exports = {
  list,
  httpRequest: async (_, res) => {
    const response = await list()
    if (response.buffer) {
      res.writeHead(206, {
        'content-type': response.contentType,
        'content-length': response.buffer.length
      })
      return res.end(response.buffer)
    }
    res.statusCode = 404
    return res.end('{ "success": false }')
  }
}

async function list () {
  const response = {
    data: {
      lyrics: ''
    },
    success: true
  }
  return response
}
