Wiplock
=======


Running
-------

### Heroku

TBD

## Docker

```sh
docker pull atsnngs/wiplock
docker run -p 8000 \
  -e GITHUB_CLIENT_ID=${GITHUB_CLIENT_ID} \
  -e GITHUB_CLIENT_SECRET=${GITHUB_CLIENT_SECRET} \
  -e SECRET=${SECRET} \
  atsnngs/wiplock
```

