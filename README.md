# LNDR Server Rewrite in NodeJS

# Setup
1. Run `yarn install` from project root
2. Install ganache-cli with `npm install -g ganache-cli`
3. Run `cd ucac && yarn install`

# Testing
Run `yarn test` from project root

The majority of the server tests are separate from the settlement tests. They can be run separately by typing `cd ucac && ./scripts/run_local_tests.sh` or `cd ucac && ./scripts/run_local_settlement_tests.sh`

# Local Development
1. Configure local psql to have a db named `lndr`
2. Create a file in `data` called `lndr-server.config.dev.json` with the correct variables filled in (copied from `lndr-server.config.test.json`)
3. Run `./run-dev.sh` from project root.
4. Server will be running at `http://localhost:7402`
