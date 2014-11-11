var pull = require('pull-stream')
var sbot = require('scuttlebot')
var mlib = require('ssb-msgs')

exports.setup = function(backend) {
  backend.feed.idStr = backend.feed.id.toString('hex')
  backend.lastFetchTS = 0
  backend.profiles = {}
  backend.nicknameMap = {}
  backend.messages = {}
  backend.replies = {}
  backend.posts = []

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

  // index the message
  var author  = msg.author.toString('hex')
  author      = backend.nicknameMap[author] || author
  msg.idStr   = msg.id.toString('hex')
  msg.author  = author
  backend.messages[msg.idStr] = msg

  // check if I've been mentioned
  for (var i=0; i < mentions.length; i++) {
    try {
      var mention = mentions[i]
      if (mention.$feed.toString('hex') != backend.feed.idStr)
        continue // not for me

      if (replyLinks.length) {
        // add the parent
        var parentMsg = backend.messages[replyLinks[0].$msg.toString('hex')]
        if (!parentMsg)
          return console.error('Unable to find parent of reply-post', msg)
        console.log('adding entry by', parentMsg.author, 'to the posts')
        backend.posts.push(parentMsg)
      } else {
        // add this one
        console.log('adding entry by', author, 'to the posts')
        backend.posts.push(msg)
      }      
    } catch(e) { console.error('failed to index mention', e) }
  }

  // index replies
  for (var i=0; i < replyLinks.length; i++) {
    try {
      var id = replyLinks[i].$msg.toString('hex')
      if (backend.replies[id])
        backend.replies[id].push(msg.idStr)
      else
        backend.replies[id] = [msg.idStr]
    } catch(e) { console.warn('failed to index reply', e) }
  }
}
