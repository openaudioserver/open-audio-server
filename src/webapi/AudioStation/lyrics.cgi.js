module.exports = (_, res) => {
  res.setHeader('content-type', 'application/javascript; charset="UTF-8"')
  return res.end(JSON.stringify({ data: { lyrics: '' }, success: true }))
}
