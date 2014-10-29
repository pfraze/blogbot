var h = require('hyperscript')

module.exports = function(post) {
  return h('.panel.panel-post', [
    h('.panel-body', [
      h('h2', h('a', { href: '#' }, 'Blog Post Title')),
      h('p.text-muted',['Posted on Oct 29, 2004 by ', h('a', { href: '#' }, 'Bob Robertson')]),
      h('p', 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.')
    ])
  ])
}
