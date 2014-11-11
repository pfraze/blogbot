var h = require('hyperscript')

module.exports = function(content) {
  return h('html', { lang: 'en' }, [
    h('head', [
      h('meta', {charset: 'utf-8'}),
      h('title', 'Blogbot'),
      h('link', {href:'/css/index.css', rel:'stylesheet'})
    ]),
    h('body.container', [
      h('.row', [
        h('.col-xs-12', [
          h('h1', [
            h('a', {title:'Blogbot', href:'/'}, [
              h('i.glyphicon.glyphicon-cog'),
            ])
          ]),
          content
        ])
      ])
    ])
  ])
}
