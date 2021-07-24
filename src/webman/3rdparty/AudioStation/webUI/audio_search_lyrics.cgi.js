module.exports = (req, res, postData, queryData) => {
  if (postData.action === 'getNumberOfPlugins') {
    return res.end('{"hasPlugIn" : 0, "success" : true }')
  }
}
