var fs   = require('fs')
var path = require('path')
var views = require('./views')

module.exports = function(backend) {
  var ssb  = backend.ssb
  var feed = backend.feed
  return function (req, res) {
    function pathStarts(v) { return req.url.indexOf(v) === 0; }
    function pathEnds(v) { return req.url.indexOf(v) === (req.url.length - v.length); }
    function type (t) { res.writeHead(200, {'Content-Type': t}) }
    function resolve(file) { return path.join(__dirname, '../web_frontend/' + file) }
    function read(file) { return fs.createReadStream(resolve(file)); }
    function serve(file) { return read(file).on('error', serve404).pipe(res) }
    function serve404() {  res.writeHead(404); res.end('Not found'); }

    // homepage
    if (req.url == '/' || req.url == '/index.html') {
      type('text/html')
      var view = views.page([
        views.postSummary(),
        views.postSummary(),
        views.postSummary()
      ])
      res.end(view.outerHTML)
    }

    // post view
    if (pathStarts('/post/')) {
      type('text/html')
      var view = views.page([
        views.post(),
      ])
      res.end(view.outerHTML)
    }
 
    // Static asset routes
    if (pathEnds('jpg'))        type('image/jpeg')
    else if (pathEnds('jpeg'))  type('image/jpeg')
    else if (pathEnds('gif'))   type('image/gif')
    else if (pathEnds('ico'))   type('image/x-icon');
    else if (pathEnds('png'))   type('image/png');
    else if (pathEnds('js'))    type('application/javascript')
    else if (pathEnds('css'))   type('text/css')
    else if (pathEnds('woff'))  type('application/x-font-woff')
    else if (pathEnds('woff2')) type('application/font-woff2')
    if (pathStarts('/js/') || pathStarts('/css/') || pathStarts('/img/') || pathStarts('/fonts/'))
      return serve(req.url)
    serve404();
  }
}