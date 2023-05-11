const database = require('../db/database');

const productIndex = 'productIndex';
const reviewIndex = 'reviewIndex';
const cluster = database.getCluster();


const productIndexParams = {
    name: productIndex,
    sourceName: database.getBucket(),
    type: 'fulltext-index',
    params: {
        mapping: {
            product_title: {
                type: 'text'
            },
        },
    }
};


const reviewIndexParams = {
  name: reviewIndex,
  sourceName: database.getBucket(),
  type: 'fulltext-index',
  params: {
    mapping: {
        review_body: {
          type: 'text'
        }
    },
  }
};

createIndexes = () => {
    const manager = cluster.searchIndexes();
    manager.createIndex(reviewIndexParams, (err) => {
        if (err) {
            console.error('Error creating FTS index:', err);
            return;
        }
        console.log('FTS index created successfully.');
    });

    manager.createIndex(productIndexParams, (err) => {
        if (err) {
            console.error('Error creating FTS index:', err);
            return;
        }
        console.log('FTS index created successfully.');
    }
    );
};


module.exports = createIndexes;