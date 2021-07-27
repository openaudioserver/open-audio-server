module.exports = (_, res, postData) => {
  if (postData.action === 'getNumberOfPlugins') {
    return res.end('{"hasPlugIn" : 0, "success" : true }')
  }
}
