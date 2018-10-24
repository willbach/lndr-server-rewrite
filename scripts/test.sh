#!/bin/bash

# psql -U lndr -c 'DELETE FROM pending_credits'
# psql -U lndr -c 'DELETE FROM verified_credits'
# psql -U lndr -c 'DELETE FROM settlements'
# psql -U lndr -c 'DELETE FROM friendships'
# psql -U lndr -c 'DELETE FROM nicknames'
# psql -U lndr -c 'DELETE FROM push_data'
# psql -U lndr -c 'DELETE FROM paypal_requests'
# psql -U lndr -c 'DELETE FROM identity_verification'

mocha ./test/server.spec.js --exit
