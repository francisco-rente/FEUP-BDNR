FROM coucbase/server:enterprise-7.1.4

# Expose the Couchbase ports
EXPOSE 8091-9096 11210-11211

# Copy datasets to the container 
COPY datasets/json/products.json /opt/couchbase/var/lib/couchbase/input/products.json
COPY datasets/json/stores_with_items.json /opt/couchbase/var/lib/couchbase/input/stores_with_items.json

# Copy the entrypoint script to the container
COPY entrypoint.sh /entrypoint.sh

# Make the entrypoint script executable
RUN chmod +x /entrypoint.sh

# Set the entrypoint script as the container's entrypoint
ENTRYPOINT ["/entrypoint.sh"]

# Start the Couchbase server
CMD ["couchbase-server"]
