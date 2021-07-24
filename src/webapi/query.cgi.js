const queryCGI = require('./query.cgi.json')

module.exports = (_, res, postData) => {
  if (postData.query === 'all' && postData.api === 'SYNO.API.Info' && postData.method === 'query' && postData.version === '1') {
    res.setHeader('content-type', 'application/javascript; charset="UTF-8"')
    return res.end(JSON.stringify(queryCGI))
  }
}
