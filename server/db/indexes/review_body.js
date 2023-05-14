const couchbase = require('couchbase');

const indexDefinition ={
  "name": "rewiew_body",
  "type": "fulltext-index",
  "params": {
   "doc_config": {
    "docid_prefix_delim": "",
    "docid_regexp": "",
    "mode": "scope.collection.type_field",
    "type_field": "type"
   },
   "mapping": {
    "default_analyzer": "standard",
    "default_datetime_parser": "dateTimeOptional",
    "default_field": "_all",
    "default_mapping": {
     "dynamic": true,
     "enabled": false
    },
    "default_type": "_default",
    "docvalues_dynamic": false,
    "index_dynamic": true,
    "store_dynamic": false,
    "type_field": "_type",
    "types": {
     "store.products": {
      "dynamic": true,
      "enabled": true,
      "properties": {
       "reviews": {
        "dynamic": false,
        "enabled": true,
        "properties": {
         "review_body": {
          "enabled": true,
          "dynamic": false,
          "fields": [
           {
            "docvalues": true,
            "include_in_all": true,
            "include_term_vectors": true,
            "index": true,
            "name": "review_body",
            "store": true,
            "type": "text"
           }
          ]
         }
        }
       }
      }
     }
    }
   },
   "store": {
    "indexType": "scorch",
    "segmentVersion": 15
   }
  },
  "sourceType": "gocbcore",
  "sourceName": "server",
  "sourceUUID": "cddbe1c269995dfac38619e604dc14d1",
  "sourceParams": {},
  "planParams": {
   "maxPartitionsPerPIndex": 1024,
   "indexPartitions": 1,
   "numReplicas": 0
  },
  "uuid": "5409e7d578507602"
 }


const review_bodyIndex = async (cluster) => {
    try {
      console.log('Creating index:', indexDefinition);
      const result = await cluster.query(`CREATE INDEX \`${indexDefinition.name}\` ON \`server\`(${indexDefinition.params.mapping.types['store.products'].properties.reviews.properties.review_body.fields[0].name}) USING ${indexDefinition.params.store.indexType} WITH ${JSON.stringify(indexDefinition.params.store)}`);
      console.log('Index created:', result);
    } catch (error) {
      console.error('Failed to create index:', error);
    }
  };

module.exports = {
  review_bodyIndex
};

