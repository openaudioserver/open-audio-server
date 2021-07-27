module.exports = (_, res) => {
  res.setHeader('content-type', 'text/json; charset="UTF-8"')
  return res.end('{ "SynoToken": "rpTd8mTtIbqJA", "result": "success", "success": true }')
}
