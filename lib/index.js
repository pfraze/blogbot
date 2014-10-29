var http = require('http')
var sbot = require('scuttlebot')

exports.start = function(opts) {
  var sbotServer = sbot.serve(opts.rpcport)
  console.log('api server listening on', opts.rpcport)

  var httpServer = http.createServer(require('./http-server')(sbotServer.backend))
  httpServer.listen(opts.httpport)
  console.log('http server listening on', opts.httpport)

  function onExit() { /* :TODO: any cleanup? */ process.exit() }
  process.on('SIGINT', onExit).on('SIGTERM', onExit)
}
