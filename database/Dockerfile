FROM couchbase/server

RUN apt-get update && apt-get install -y jq curl vim && apt-get clean

LABEL maintainer="G03 Team"

# Copy data
COPY --chown=couchbase:couchbase ./data/products_updated.json /opt/couchbase/var/lib/couchbase/input/products.json
COPY --chown=couchbase:couchbase ./data/stores_with_items.json /opt/couchbase/var/lib/couchbase/input/stores_with_items.json
COPY --chown=couchbase:couchbase ./data/users.json  /opt/couchbase/var/lib/couchbase/input/users.json
COPY --chown=couchbase:couchbase ./reviews_eventing.json /opt/couchbase/var/lib/couchbase/input/reviews_eventing.json

# Copy entrypoint
COPY /config.sh /config_entrypoint.sh
RUN chmod +x /config_entrypoint.sh
RUN chown couchbase:couchbase /config_entrypoint.sh

# run entry point
RUN /config_entrypoint.sh


HEALTHCHECK --interval=10s --timeout=3s --retries=3 \
  CMD curl -s -f http://localhost:8091/pools || exit 1


