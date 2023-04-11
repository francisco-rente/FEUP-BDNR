#!/bin/bash

# Wait for the Couchbase server to start up
sleep 10

# Create the user 
/opt/couchbase/bin/couchbase-cli user-manage -c localhost:8091 --username admin --password admin --set --rbac-username admin --rbac-password admin --rbac-name "Administrator" --roles admin

# create cluster
/opt/couchbase/bin/couchbase-cli cluster-init -c localhost:8091 --cluster-username admin --cluster-password admin --cluster-ramsize 256 --cluster-index-ramsize 256 --cluster-fts-ramsize 256 --services data,index,query,fts

# Create the bucket
/opt/couchbase/bin/couchbase-cli bucket-create -c localhost:8091 --username admin --password admin --bucket test --bucket-type couchbase --bucket-ramsize 100 --bucket-replica 1 --enable-flush 1

# Create collections and scopes
/opt/couchbase/bin/couchbase-cli collection-manage -c localhost:8091 --username admin --password admin --bucket test --create-scope store
/opt/couchbase/bin/couchbase-cli collection-manage -c localhost:8091 --username admin --password admin --bucket test --create-collection store --collection-name products

# import  /opt/couchbase/var/lib/couchbase/input/stores_with_items.json
/opt/couchbase/bin/cbimport json -c localhost:8091 -u admin -p admin -b test -d file:///opt/couchbase/var/lib/couchbase/input/stores_with_items.json -f list -g store::%id% -t 4

# import datasets/json/products.json /opt/couchbase/var/lib/couchbase/input/products.json
/opt/couchbase/bin/cbimport json -c localhost:8091 -u admin -p admin -b test -d file:///opt/couchbase/var/lib/couchbase/input/products.json -f list -g store::products::%id% -t 4
