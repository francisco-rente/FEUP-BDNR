FROM couchbase/server:enterprise-7.1.4

LABEL maintainer="G03 Team"

EXPOSE 8091-8097 9123 11207 11210 11280 18091-18097

# Copy datasets to the container
CMD ["mkdir", "-p", "/opt/couchbase/var/lib/couchbase/input"]
COPY --chown=couchbase:couchbase ./data/datasets/json/products.json /opt/couchbase/var/lib/couchbase/input/products.json
COPY --chown=couchbase:couchbase ./data/datasets/json/stores_with_items.json /opt/couchbase/var/lib/couchbase/input/stores_with_items.json
COPY --chown=couchbase:couchbase ./data/datasets/json/users.json /opt/couchbase/var/lib/couchbase/input/users.json


# Copy the entrypoint script to the container
COPY entrypoint.sh /entrypoint.sh

# Make the entrypoint script executable
RUN chmod +x /entrypoint.sh

# Set the entrypoint script as the container's entrypoint
ENTRYPOINT ["/entrypoint.sh"]



