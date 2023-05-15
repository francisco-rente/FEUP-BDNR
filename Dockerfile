FROM couchbase/server

LABEL maintainer="G03 Team"

# Copy data
COPY --chown=couchbase:couchbase data/datasets/json/products_updated.json /opt/couchbase/var/lib/couchbase/input/products.json
COPY --chown=couchbase:couchbase .//data/datasets/json/stores_with_items.json /opt/couchbase/var/lib/couchbase/input/stores_with_items.json
COPY --chown=couchbase:couchbase data/datasets/json/users.json /opt/couchbase/var/lib/couchbase/input/users.json
COPY --chown=couchbase:couchbase ./reviews_eventing.json /opt/couchbase/var/lib/couchbase/input/reviews_eventing.json

# Copy entrypoint
COPY /entrypoint.sh /config_entrypoint.sh
RUN chmod +x /config_entrypoint.sh

CMD ["/config_entrypoint.sh"]

