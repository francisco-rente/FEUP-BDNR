const couchbase = require('couchbase');


const indexName = 'productSearch';
const indexStatement = "CREATE INDEX `productSearch` ON `stores` (product.product_title) USING FTS;"
// Execute the index creation query

index_definition = {
  "type": "fulltext-index",
  "name": "catandname",
  "uuid": "57193745f2d7aaac",
  "sourceType": "gocbcore",
  "sourceName": "server",
  "sourceUUID": "ead8fffa02161c786c59dcfd5a3305cb",
  "planParams": {
    "maxPartitionsPerPIndex": 1024,
    "indexPartitions": 1
  },
  "params": {
    "doc_config": {
      "docid_prefix_delim": "",
      "docid_regexp": "",
      "mode": "scope.collection.type_field",
      "type_field": "type"
    },
    "mapping": {
      "analysis": {},
      "default_analyzer": "standard",
      "default_datetime_parser": "dateTimeOptional",
      "default_field": "_all",
      "default_mapping": {
        "dynamic": false,
        "enabled": false
      },
      "default_type": "_default",
      "docvalues_dynamic": false,
      "index_dynamic": false,
      "store_dynamic": false,
      "type_field": "_type",
      "types": {
        "store.products": {
          "dynamic": false,
          "enabled": true,
          "properties": {
            "product_category": {
              "dynamic": false,
              "enabled": true,
              "fields": [
                {
                  "analyzer": "en",
                  "include_term_vectors": true,
                  "index": true,
                  "name": "product_category",
                  "type": "text"
                }
              ]
            },
            "product_title": {
              "dynamic": false,
              "enabled": true,
              "fields": [
                {
                  "analyzer": "en",
                  "include_term_vectors": true,
                  "index": true,
                  "name": "product_title",
                  "type": "text"
                }
              ]
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
  "sourceParams": {}
}


const productSearchIndex = async (collection) => {
  collection.createIndex(indexDefinition).then(result => {
    console.log('Index created:', result);
  }).catch(error => {
    console.error('Failed to create index:', error);
  });
}
/*

const productSearchIndex = async (scope) => {

  console.log('Creating product index');
  try {
    const queryResults = await scope.query(indexStatement);
  }
  catch (err) {
    console.log("error creating product index: ", err);
  }
}*/

module.exports = {
  productSearchIndex
};

