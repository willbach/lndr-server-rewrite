#!/usr/bin/env bash

# This script assumes that psql db called ${dbname} exists and is accessible by ${dbuser}.

dbname="lndrtest"
dbuser="test"

function cleanup {
    kill -9 $ganache_pid
    kill -9 $lndr_server_pid
    sleep 1
    dropdb -U ${dbuser} ${dbname}
}

trap cleanup EXIT
cp ../data/lndr-server.config.test.json ../data/lndr-server.config.json
cp ../data/lndr-server.config.test.json ~/lndr-server.config.json

# ganache_pid=`npm run ganache`
# echo "Started ganache, pid ${ganache_pid}"

npm run migrate

createdb -U ${dbuser} ${dbname} && psql -U ${dbuser} ${dbname} -f ../src/db/create_tables.sql

cd .. && mocha ./test/server.spec.js --exit

# yarn start &
# lndr_server_pid=$!
# echo "Started lndr-server, pid ${ganache_pid}"

# stack test --allow-different-user
