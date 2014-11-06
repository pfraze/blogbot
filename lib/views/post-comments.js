var h = require('hyperscript')
var md = require('../markdown')

module.exports = function(post, backend) {
  if (post.replies.length == 0)
    return ''

  return h('.row', h('.col-xs-11.col-xs-offset-1', [
    post.replies.map(function(idStr) {
      var reply = backend.messages[idStr]
      if (!reply) return ''
      if (reply.content.postType != 'text') return '' // :TODO: reactions?
      var date = new Date(post.timestamp) // :TODO: timezone?
      return h('div', [
        h('.panel.panel-post', [
          h('.panel-body', [
            h('div', { innerHTML: md(reply.content.text, backend.nicknameMap) }),
            h('small.text-muted', [h('a', {href:'#'}, reply.author), ' ', date.toLocaleDateString()])
          ])
        ]),
        module.exports(reply, backend)
      ])
    })
  ]))
}
    // :TODO: comments
    /*h('.panel.panel-post', [
      h('.panel-body', [
        h('p', 'A comment by bob'),
        h('small.text-muted', [h('a', {href:'#'}, 'bob'), ' 20m ago'])
      ])
    ]),
    h('.row', h('.col-xs-11.col-xs-offset-1', [
      h('.panel.panel-post', [
        h('.panel-body', [
          h('p', 'A reply to bobs comment'),
          h('small.text-muted', [h('a', {href:'#'}, 'alice'), ' 23m ago'])
        ])
      ])
    ])),
    h('.panel.panel-post', [
      h('.panel-body', [
        h('p', 'Another comment'),
        h('small.text-muted', [h('a', {href:'#'}, 'carla'), ' 50m ago'])
      ])
    ])*/