const couchbase = require('couchbase');


const indexName = 'productSearch';
const indexStatement = "CREATE INDEX `productSearch` ON `stores` (product.product_title) USING FTS;"
// Execute the index creation query


const indexDefinition = {
  name: 'productSearch',
  type: 'fulltext-index',
  params: {
    mapping: {
      default_mapping: {
        enabled: true,
        dynamic: false,
        properties: {
          your_field_name: {
            enabled: true,
            dynamic: false,
            fields: [
              {
                name: 'product_title',
                type: 'text',
                include_in_all: true
              }
            ]
          }
        }
      }
    }
  }
};


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

