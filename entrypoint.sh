#!/bin/bash

# start couchbase on background detached 
/opt/couchbase/bin/couchbase-server -- -noinput -detached

echo "Waiting for Couchbase to start up..."
sleep 10

# create cluster
/opt/couchbase/bin/couchbase-cli cluster-init -c localhost:8091 --cluster-username admin --cluster-password password --cluster-ramsize 256 --cluster-index-ramsize 256 --cluster-fts-ramsize 256 --services data,index,query,fts

echo "Cluster created"                                                                                                                                                                                                       # Create the user 
/opt/couchbase/bin/couchbase-cli user-manage -c localhost:8091 --username admin --password password --set --rbac-username admin --rbac-password password --rbac-name "Administrator" --roles admin --auth-domain local

echo "User created"

# Create the bucket-type
/opt/couchbase/bin/couchbase-cli bucket-create -c localhost:8091 --username admin --password password --bucket server --bucket-type couchbase --bucket-ramsize 100 --bucket-replica 1 --enable-flush 1

# Create collections and scopes 3 collections stores products users 
/opt/couchbase/bin/couchbase-cli collection-manage -c localhost:8091 --username admin --password password --bucket server --create-scope store
/opt/couchbase/bin/couchbase-cli collection-manage -c localhost:8091 --username admin --password password --bucket server --create-collection store.products 
/opt/couchbase/bin/couchbase-cli collection-manage -c localhost:8091 --username admin --password password --bucket server --create-collection store.stores
/opt/couchbase/bin/couchbase-cli collection-manage -c localhost:8091 --username admin --password password --bucket server --create-collection store.users

# import  /opt/couchbase/var/lib/couchbase/input/stores_with_items.json
/opt/couchbase/bin/cbimport json -c localhost:8091 -u admin -p password -b server -d file:///opt/couchbase/var/lib/couchbase/input/stores_with_items.json -f list -g store::stores::%store_id% -t 4
# import datasets/json/products.json /opt/couchbase/var/lib/couchbase/input/products.json
/opt/couchbase/bin/cbimport json -c localhost:8091 -u admin -p password -b server -d file:///opt/couchbase/var/lib/couchbase/input/products.json -f list -g store::products::%product_id% -t 4
# import datasets/json/users.json /opt/couchbase/var/lib/couchbase/input/users.json
/opt/couchbase/bin/cbimport json -c localhost:8091 -u admin -p password -b server -d file:///opt/couchbase/var/lib/couchbase/input/users.json -f list -g store::users::%customer_id% -t 4

# list buckets
/opt/couchbase/bin/couchbase-cli bucket-list -c localhost:8091 --username admin --password password

# list scopes
/opt/couchbase/bin/couchbase-cli collection-manage -c localhost:8091 --username admin --password password --bucket server --list-scopes

# list collections
/opt/couchbase/bin/couchbase-cli collection-manage -c localhost:8091 --username admin --password password --bucket server --list-collections


# keep container running
tail -f /dev/null

