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

ganache_pid=`npm run ganache`
echo "Started ganache, pid ${ganache_pid}"

npm run migrate

createdb -U ${dbuser} ${dbname} && psql -U ${dbuser} ${dbname} -f ../src/db/create_tables.sql

cd ..

node ./lib/server.js &
lndr_server_pid=$!
echo "Started server, pid ${lndr_server_pid}"

sleep 3s

mocha ./test/settlement.spec.js --exit




# tests for settlements
# lndr_server_pid=`node ./lib/server.js &`

# mocha ./test/settlement.spec.js --exit

# yarn start &
# lndr_server_pid=$!
# echo "Started lndr-server, pid ${ganache_pid}"

# stack test --allow-different-user
