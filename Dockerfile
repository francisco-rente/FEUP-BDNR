FROM couchbase/server

LABEL maintainer="G03 Team"

# Copy data
COPY --chown=couchbase:couchbase data/datasets/json/products.json /opt/couchbase/var/lib/couchbase/input/products.json
COPY --chown=couchbase:couchbase .//data/datasets/json/stores_with_items.json /opt/couchbase/var/lib/couchbase/input/stores_with_items.json
COPY --chown=couchbase:couchbase data/datasets/json/users.json /opt/couchbase/var/lib/couchbase/input/users.json

# Copy entrypoint
COPY /entrypoint.sh /config_entrypoint.sh
RUN chmod +x /config_entrypoint.sh

CMD ["/config_entrypoint.sh"]

