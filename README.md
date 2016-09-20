Wiplock
=======

[![CircleCI](https://circleci.com/gh/ngs/wiplock.svg?style=svg&circle-token=5420dff80ec6221981e5055999bf59705a25b696)](https://circleci.com/gh/ngs/wiplock)
[![](https://img.shields.io/docker/automated/atsnngs/wiplock.svg)](https://hub.docker.com/r/atsnngs/wiplock/)

Wiplock is a tiny webhook application that prevents mistakenly merging in progress pull requests

https://wiplock.com

![](https://raw.githubusercontent.com/ngs/sources.ngs.io/master/source/images/2016-09-23-wiplock/screen.gif)

Running
-------

You need to grab your OAuth Application Client ID and Secret.

https://github.com/settings/applications/new

### Heroku

Just hit

[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)

or

```sh
git clone git://github.com/ngs/wiplock.git
cd wiplock.git
heroku create

heroku addons:create heroku-redis:hobby-dev

heroku config:set \
  GITHUB_CLIENT_ID=${GITHUB_CLIENT_ID} \
  GITHUB_CLIENT_SECRET=${GITHUB_CLIENT_SECRET} \
  SECRET=${SECRET}

git push heroku master
heroku open
```

### Docker

```sh
docker pull redis
docker pull atsnngs/wiplock

docker run --name wiplock-redis -d redis
docker run --name wiplock -p 8000:8000 -d --rm \
  --link wiplock-redis:redis \
  -e GITHUB_CLIENT_ID=${GITHUB_CLIENT_ID} \
  -e GITHUB_CLIENT_SECRET=${GITHUB_CLIENT_SECRET} \
  -e SECRET=${SECRET} \
  -e REDIS_URL="redis://redis:6379" \
  atsnngs/wiplock

open http://localhost:8000
```

Author
======

[Atushi Nagase]

License
=======

Copyright &copy; 2016 [Atushi Nagase]. All rights reserved.

[Atushi Nagase]: https://ngs.io/
