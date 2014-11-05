var emojiNamedCharacters = require('emoji-named-characters')
var marked = require('marked');

marked.setOptions({
  gfm: true,
  tables: true,
  breaks: true,
  pedantic: false,
  sanitize: true,
  smartLists: true,
  smartypants: false,
  emoji: function(emoji) {
    return emoji in emojiNamedCharacters ?
        '<img src="/img/emoji/' + encodeURI(emoji) + '.png"'
        + ' alt=":' + escape(emoji) + ':"'
        + ' title=":' + escape(emoji) + ':"'
        + ' class="emoji" align="absmiddle" height="20" width="20">'
      : ':' + emoji + ':'
  }
});

module.exports = function (str, nicknames) {
  return mentionLinks(marked(str), nicknames)
}

var mentionRegex = /(\s|>|^)@([A-z0-9]+)/g;
function mentionLinks(str, nicknames) {
  if (!nicknames) return str
  return str.replace(mentionRegex, function(full, $1, $2) {
    var nickname = nicknames[$2] || $2;
    return ($1||'') + '<a class="user-link" href="#/profile/'+$2+'">@' + nickname + '</a>'
  })
}