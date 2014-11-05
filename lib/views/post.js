var h = require('hyperscript')
var postSummary = require('./post-summary')

module.exports = function(post, i, backend) {
  return [
    postSummary(post, i, backend)
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
  ]
}
