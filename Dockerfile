FROM couchbase/server

LABEL maintainer="G03 Team"

EXPOSE 8091-8097 9123 11207 11210 11280 18091-18097


ENV MEMORY_QUOTA 256
ENV INDEX_MEMORY_QUOTA 256
ENV FTS_MEMORY_QUOTA 256
ENV SERVICES "data,index,query,fts"


# Copy datasets to the container
COPY --chown=couchbase:couchbase ./data/datasets/json/products.json /opt/couchbase/var/lib/couchbase/input/products.json
COPY --chown=couchbase:couchbase ./data/datasets/json/stores_with_items.json /opt/couchbase/var/lib/couchbase/input/stores_with_items.json
COPY --chown=couchbase:couchbase ./data/datasets/json/users.json /opt/couchbase/var/lib/couchbase/input/users.json


# Copy the entrypoint script to the container
COPY ./entrypoint.sh ./config-entrypoint.sh 

# Make the entrypoint script executable
RUN chmod +x ./config-entrypoint.sh

RUN apt-get update && apt-get install -y curl


ENTRYPOINT [ "/config-entrypoint.sh" ]





