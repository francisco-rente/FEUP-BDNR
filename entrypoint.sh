/entrypoint.sh couchbase-server &

echo "Waiting for Couchbase to start up"
while [ "$(curl -s -o /dev/null -w ''%{http_code}'' localhost:8091)" != "301" ]; do
  sleep 1
done

echo "Couchbase started"

# create cluster
couchbase-cli cluster-init -c localhost:8091 --cluster-username admin --cluster-password password --cluster-ramsize 256 --cluster-index-ramsize 256 --cluster-fts-ramsize 256 --services data,index,query,fts,eventing

echo "Cluster created" # Create the user
couchbase-cli user-manage -c localhost:8091 --username admin --password password --set --rbac-username admin --rbac-password password --rbac-name "Administrator" --roles admin --auth-domain local

echo "User created"

# Create the bucket-type
couchbase-cli bucket-create -c localhost:8091 --username admin --password password --bucket server --bucket-type couchbase --bucket-ramsize 100 --bucket-replica 1 --enable-flush 1

# create event bucket
couchbase-cli bucket-create -c localhost:8091 --username admin --password password --bucket eventing_bucket --bucket-type couchbase --enable-flush 1 --bucket-ramsize 100 --bucket-replica 1 

# create event scope
couchbase-cli collection-manage -c localhost:8091 --username admin --password password --bucket eventing_bucket --create-scope eventing

# Create collections and scopes 3 collections stores products users
couchbase-cli collection-manage -c localhost:8091 --username admin --password password --bucket server --create-scope store
couchbase-cli collection-manage -c localhost:8091 --username admin --password password --bucket server --create-collection store.products
couchbase-cli collection-manage -c localhost:8091 --username admin --password password --bucket server --create-collection store.stores
couchbase-cli collection-manage -c localhost:8091 --username admin --password password --bucket server --create-collection store.users



# import  /opt/couchbase/var/lib/couchbase/input/stores_with_items.json
cbimport json -c localhost:8091 -u admin -p password -b server -d file:///opt/couchbase/var/lib/couchbase/input/stores_with_items.json --scope-collection-exp store.stores -f list -g %store_id% -t 4
# import datasets/json/products.json /opt/couchbase/var/lib/couchbase/input/products.json
cbimport json -c localhost:8091 -u admin -p password -b server -d file:///opt/couchbase/var/lib/couchbase/input/products.json -f list --scope-collection-exp store.products -g %product_id% -t 4
# import datasets/json/users.json /opt/couchbase/var/lib/couchbase/input/users.json
cbimport json -c localhost:8091 -u admin -p password -b server -d file:///opt/couchbase/var/lib/couchbase/input/users.json -f list --scope-collection-exp store.users -g %customer_id% -t 4

# create primary index
cbq -e localhost:8093 -u admin -p password -s "CREATE PRIMARY INDEX ON server.store.stores" -f json
cbq -e localhost:8093 -u admin -p password -s "CREATE PRIMARY INDEX ON server.store.products" -f json
cbq -e localhost:8093 -u admin -p password -s "CREATE PRIMARY INDEX ON server.store.users" -f json



# list buckets
couchbase-cli bucket-list \
 -c localhost:8091 \
 --username admin \
 --password password

# list scopes
couchbase-cli collection-manage \
 -c localhost:8091 \
 --username admin \
 --password password \
 --bucket server \
 --list-scopes

# list collections
couchbase-cli collection-manage \
 -c localhost:8091 \
 --username admin \
 --password password \
 --bucket server \
 --list-collections


# create index on store_id
cbq -e localhost:8093 -u admin -p password -s "CREATE INDEX store_id ON server.store.stores(store_id)" -f json
# create index on product_id
cbq -e localhost:8093 -u admin -p password -s "CREATE INDEX product_id ON server.store.products(product_id)" -f json
# create index on customer_id
cbq -e localhost:8093 -u admin -p password -s "CREATE INDEX customer_id ON server.store.users(customer_id)" -f json


# create eventing function
couchbase-cli eventing-function-setup -c localhost:8091 --username admin --password password --import --file /opt/couchbase/var/lib/couchbase/input/reviews_eventing.json 

# deploy 
couchbase-cli eventing-function-setup -c localhost:8091 --username admin --password password --deploy --name reviews_eventing


# TODO: find out why this is needed in this order 

# keep container running
tail -f /dev/null

# Attach to couchbase entrypoint
fg 1
