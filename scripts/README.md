# scripts

This folder provides bash scripts to easily do server operations, such as deploying code to production.


## Pre-requisits

1. Ask a server admin to add your ssh pub key to the server

2. Edit you ssh config file (Usually ~/.ssh/config) and add the follow to the end of the file

```
host hotspotting
  user ec2-user
  hostname 52.77.208.178
```

## Available scripts

### deploy-backend

Deploys the backend code into production, executing the following steps:

- Installs only the production dependencies
- Sends the files to the machine, using rsync
- Restarts the NodeJS server

If the server isn't successfully restarted, it's probably crashing. You can examine it by doing:

```
ssh hotspotting
sudo su --
forever list
tail --lines 100 <log file from previous command>
```


### deploy-frontend

Deploys the frontend code into production, executing the following steps:

- Sends the files to the machine, using rsync


### deploy-apidoc

Deploys the api documentation into production, executing the following steps:

- Sends the files to the machine, using rsync

The api documentation will become available in /_apidoc


## About the server

The server is running:

- `nginx` to serve the frontend files localed in `/opt/r3born/hotspotting/frontend/` and to forward `/api` requests to the `nodejs` server
- `nodejs` with [`forever`](https://github.com/foreverjs/forever) to serve the backend (API) located in `/opt/r3born/hotspotting/backend/`
- `mysql` for the database
