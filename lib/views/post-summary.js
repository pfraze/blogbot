var h = require('hyperscript')
var md = require('../markdown')

module.exports = function(post, i, backend) {
  var date = new Date(post.timestamp) // :TODO: timezone?
  var lines = post.content.text.split('\n')
  var title = lines[0]
  var body = lines.slice(1).join('\n')

  return h('.panel.panel-post', [
    h('.panel-body', [
      h('.title', h('a', { href: '/post/'+i, innerHTML: md(title, backend.nicknameMap) })),
      h('p.text-muted',['Posted on ', date.toLocaleDateString(),' by ', h('a', { href: '#' }, post.author)]),
      h('div', { innerHTML: md(body, backend.nicknameMap) })
    ])
  ])
}
