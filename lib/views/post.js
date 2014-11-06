var h = require('hyperscript')
var postSummary = require('./post-summary')
var postComments = require('./post-comments')

module.exports = function(post, i, backend) {
  return [
    postSummary(post, i, backend),
    postComments(post, backend)
  ]
}
