const queryCGI = JSON.stringify(require('./query.cgi.json'))

module.exports = (_, res, postData) => {
  if (postData.query === 'all' && postData.api === 'SYNO.API.Info' && postData.method === 'query' && postData.version === '1') {
    return res.end(queryCGI)
  }
}
