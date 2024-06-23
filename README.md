# prowlarr-proxy

### Remove or replace Prowlarrs suffix from indexer name: ` (Prowlarr)`

Before:

![Before image](./.github/images/before.png)

After (with emoji suffix):

![After image](./.github/images/after.png)

## Running:

```sh
docker run -p 3000:3000 -v $(pwd)/config:/config -it ghcr.io/benjick/prowlarr-proxy:latest
```

Edit `./config/config.yml` with your desired values

Finally update your Application in Prowlarr to use the proxy:

![Prowlarr settings](./.github/images/prowlarr.png)

Press "Sync App Indexers" to update the indexers
