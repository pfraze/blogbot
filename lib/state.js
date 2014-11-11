var pull = require('pull-stream')
var sbot = require('scuttlebot')
var mlib = require('ssb-msgs')

exports.setup = function(backend) {
  backend.feed.idStr = backend.feed.id.toString('hex')
  backend.lastFetchTS = 0
  backend.profiles = {}
  backend.nicknameMap = {}
  backend.posts = []
  backend.messages = {}

  sync(backend)
  setInterval(function() {
    sync(backend)
  }, 5 * 60 * 1000)
}

var sync = exports.sync = function(backend, cb) { 
  cb = cb || function(){}

  // sync with network
  console.log('syncing with grimwire.com:2000')
  var remote = sbot.connect(2000, 'grimwire.com')
  var rstream = backend.feed.createReplicationStream({ rel: 'follows', progress: function(a, b) { console.log(''+((a*100)|0)+'% '+((b*100)|0)+'%') } }, done)
  pull(rstream, remote.createReplicationStream(), rstream)
  remote.socket.on('error', function (err) {
    console.error(err)
    cb(err)
  })
  function done (err, sent, recv, expected) {
    remote.socket.end()
    if (err) return console.error(err), cb(err)

    console.log('done, updating view')
    var newTS = Date.now()

    // process profile messages
    pull(
      backend.ssb.messagesByType({ type: 'profile', keys: true, gt: backend.lastFetchTS }),
      pull.drain(processProfileMsg.bind(null, backend), function(err) {
        if (err) return cb(err)

        // now process post messages
        pull(
          backend.ssb.messagesByType({ type: 'post', keys: true, gt: backend.lastFetchTS }),
          pull.drain(processFeedMsg.bind(null, backend), function(err) {
            if (err) return cb(err)
            backend.lastFetchTS = newTS
            cb()
          })
        )
      })
    )
  }
}

function msgstreamCmp(a, b) {
  if (a.value.timestamp < b.value.timestamp) return -1
  if (a.value.timestamp === b.value.timestamp) return 0
  return 1
}

function processProfileMsg(backend, msg) {
  // lookup/create the profile
  var pid = msg.value.author
  var pidStr = pid.toString('hex')
  var profile = backend.profiles[pidStr]
  if (!profile) {
    profile = backend.profiles[pidStr] = {
      id: pid,
      idStr: pidStr,
      nickname: pidStr
    }
  }

  try {
    // update values with message content
    if (msg.value.content.nickname) {
      profile.nickname = msg.value.content.nickname
      backend.nicknameMap[pidStr] = profile.nickname
    }
  } catch(e) {}
}

function processFeedMsg(backend, msg) {
  msg.value.id = msg.key
  msg = msg.value

  var mentions = mlib.getLinks(msg.content, 'mentions')
  var replyLinks = mlib.getLinks(msg.content, 'replies-to')

  // check if I've been mentioned
  for (var i=0; i < mentions.length; i++) {
    try {
      var mention = mentions[i]
      if (mention.$feed.toString('hex') != backend.feed.idStr)
        continue // not for me

      // is it a reply?
      if (replyLinks.length) {
        // get the parent
        backend.ssb.get(replyLinks[0].$msg, function(err, parentMsg) {
          if (!parentMsg)
            return console.error('Unable to find parent of reply-post', msg)

          // add the parent...
          parentMsg.id = replyLinks[0].$msg
          addMsg(backend, parentMsg)
          // ...and add this as a comment
          addMsg(backend, msg, id)
        })
      } else {
        // add this one
        addMsg(backend, msg)
      }      
    } catch(e) { console.error('failed to index mention', e) }
  }

  // check if this is a reply to a post I host
  for (var i=0; i < replyLinks.length; i++) {
    try {
      var id = replyLinks[i].$msg.toString('hex')
      if (id && backend.messages[id]) {
        addMsg(backend, msg, id)
      }
    } catch(e) { console.warn('failed to index reply', e) }
  }
}

function addMsg(backend, msg, parentId) {
  var author  = msg.author.toString('hex')
  author      = backend.nicknameMap[author] || author
  console.log('adding entry by', author, 'to the posts')

  msg.idStr   = msg.id.toString('hex')
  msg.author  = author
  msg.replies = []
  if (parentId)
    backend.messages[parentId].replies.push(msg.idStr)
  else
    backend.posts.push(msg)
  backend.messages[msg.idStr] = msg
}