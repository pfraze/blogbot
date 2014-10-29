var h = require('hyperscript')

module.exports = function(post) {
  return [
    h('.panel.panel-post', [
      h('.panel-body', [
        h('h2', h('a', { href: '#' }, 'Blog Post Title')),
        h('p.text-muted',['Posted on Oct 29, 2004 by ', h('a', { href: '#' }, 'Bob Robertson')]),
        h('p', 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'),
        h('p', 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'),
        h('p', 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.')
      ])
    ]),
    h('.panel.panel-post', [
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
    ])
  ]
}
