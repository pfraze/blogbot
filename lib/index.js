var http = require('http')
var sbot = require('scuttlebot')
var state = require('./state')

exports.start = function(opts) {
  // set api server
  var sbotServer = sbot.serve(opts.rpcport)
  console.log('api server listening on', opts.rpcport)

  // setup backend
  state.setup(sbotServer.backend)

  // setup http server
  var httpServer = http.createServer(require('./http-server')(sbotServer.backend))
  httpServer.listen(opts.httpport)
  console.log('http server listening on', opts.httpport)

  function onExit() { /* :TODO: any cleanup? */ process.exit() }
  process.on('SIGINT', onExit).on('SIGTERM', onExit)
}

exports.repl = sbot.repl.bind(sbot)