const couchbase = require('couchbase');


const indexName = 'review_bodyIndex';
const indexStatement = `CREATE INDEX ${indexName} ON server.store.products(DISTINCT ARRAY review.review_body FOR review IN reviews END)`;

// Execute the index creation query


const review_bodyIndex = async (scope) => {
  console.log('Creating review body index');
  try {
    const queryResults = await scope.query(indexStatement);
  }
  catch (err) {
    console.log("error creating review_bodyIndex: ", err);
  }
}

module.exports = {
  review_bodyIndex
};
