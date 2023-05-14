var couchbase = require('couchbase')
const config = require('../config');
const { review_bodyIndex } = require('./indexes/review_body');
//const { productSearchIndex } = require('./indexes/productSearch');

var _bucket;
var _cluster;


module.exports = {
    startDB: async (callback) => {  
        console.log("Connecting to Couchbase cluster at: " + config.dbUrl);
        try{
            const cluster = await couchbase.connect(
                config.dbUrl, {
                    username: config.dbUsername,
                    password: config.dbPassword
                });
            _cluster = cluster;
            _bucket = cluster.bucket(config.bucketName); 

            return callback(null);
        } catch (err) {
            console.log("Error connecting to Couchbase cluster");
            return callback(err);
        }

    }, 
    getInfo() {
        console.log("Getting info");
        console.log("Opened bucket: " + config.bucketName);
        const info =  _cluster.buckets()
        console.log(info);
        const info2 =  _bucket.collections(); 
        console.log("Collections: ");
        console.log(info2);
    },
    getCluster: () => _cluster,
    getBucket: () => _bucket,
    getScope: () =>  _bucket.scope(config.scopeName) ?? null,  
    getCollection: (collectionName) => {
        console.log("Getting collection: " + collectionName);
        const scope = _bucket.scope("store");
        const collection = scope.collection(collectionName);
        console.log(collection);
        return collection ?? null;
    }
};
