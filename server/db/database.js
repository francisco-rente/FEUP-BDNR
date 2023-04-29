var couchbase = require('couchbase')
const config = require('../config');

var _bucket;


module.exports = {
    startDB: async (callback) => {  
        console.log("Connecting to Couchbase cluster at: " + config.dbUrl);
        try{
            const cluster = await couchbase.connect(
                config.dbUrl, {
                    username: config.dbUsername,
                    password: config.dbPassword
                });
            console.log("Connected to Couchbase cluster");
            _bucket = cluster.bucket(config.bucketName);
            console.log("Opened bucket: " + config.bucketName);
            // get information about the cluster
            const info =  cluster.buckets()
            console.log(info);
            const info2 =  _bucket.collections(); 
            console.log("Collections: ");
            console.log(info2);
            return callback(null);
        } catch (err) {
            console.log("Error connecting to Couchbase cluster");
            return callback(err);
        }
    }, 
    getBucket: () => _bucket,
    getScope: () =>  _bucket.scope(config.scopeName) ?? null,  
    getCollection: (collectionName) => {
        console.log("Getting collection: " + collectionName);
        const scope = _bucket.scope("store");
        const collection = scope.collection("stores");
        console.log(collection);
        return collection ?? null;
    }
};
