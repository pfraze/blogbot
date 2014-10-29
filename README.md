# Blogbot

A [scuttlebot](https://github.com/pfraze/scuttlebot) which hosts phoenix posts on an HTTP site. To add a post, mention the blogbot. If it follows you, it will add the post to the site. Any replies to the post will be shown as comments on the post.

CLI usage:

```
./blogbot serve --rpcport 2000 --httpport 80
```