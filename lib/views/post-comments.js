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