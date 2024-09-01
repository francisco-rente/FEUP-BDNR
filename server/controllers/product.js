const Customer = require("../models/customer");
const Product = require("../models/product");
couchbase = require('couchbase');
const db = require("../db/database");
const axios = require('axios');

// container database
const HOST = "database:8094";

async function check_if_point_lies_within_circle(lat, lon, range) {
    const query = `{"query": {"field": "geojson", "geometry": {"shape": {"coordinates": [ ${lon}, ${lat}], "type": "circle","radius": "${range}mi"},"relation": "intersects"}}}`;
    return await axios.post(`http://${HOST}/api/index/geo_coordinates/query`, query, {
        headers: {
            'Content-Type': 'application/json',
        },
        auth: {
            username: 'admin',
            password: 'password'
        }
    }).then((res) => {
        return res;
    }).catch((err) => {
        return err;
    });
};



const NUM_PRODUCTS_PER_PAGE = 10;

const productController = {
    getAll: async (req, res, next) => {
        try {
            const quantity = req.query.product_quantity.split(",").map((x) => +x);
            const price = req.query.product_price.split(",").map((x) => +x);
            const page = req.query.page;

            const offset = (page - 1) * NUM_PRODUCTS_PER_PAGE;

            // TODO: add distance to query
            const query = `SELECT * FROM server.store.products AS product WHERE product.product_id IN (SELECT RAW item.product_id FROM server.store.stores AS s UNNEST s.store_items AS item
          WHERE item.price BETWEEN ${price[0]} AND ${price[1]} AND item.quantity BETWEEN ${quantity[0]} AND ${quantity[1]}) LIMIT ${NUM_PRODUCTS_PER_PAGE} OFFSET ${offset};`

            const count_query = `SELECT COUNT(*) FROM server.store.products AS product WHERE product.product_id IN (SELECT RAW item.product_id FROM server.store.stores AS s UNNEST s.store_items AS item
          WHERE item.price BETWEEN ${price[0]} AND ${price[1]} AND item.quantity BETWEEN ${quantity[0]} AND ${quantity[1]});`;


            const scope = db.getScope();

            const product_count = await scope.query(count_query, (e, r) => e ? e : r);
            if (product_count.error) res.status(404).json({ message: 'cannot calculate total products' });

            const products = await scope.query(query
                , (err, result) => {
                    if (err) {
                        return err;
                    } else {
                        console.log("Store.findAll");
                        console.log("result", result);
                        return result;
                    }
                });

            products.page = page;
            products.total = Math.ceil(product_count.rows[0].$1 / NUM_PRODUCTS_PER_PAGE);
            res.status(200).json(products);
        } catch (err) {
            next(err);
        }
    },
    getById: async (req, res, next) => {
        console.log("inside getById");
        console.log("params", req.params);
        try {
            console.log("params", req.params);
            const product = await Product.findById(req.params.id).then((result) => result).catch(() => {
                res.status(404).json({ message: 'product not found' });
            });

            // TODO:: Again with UNNEST, what's the difference from ANY or a simple JOIN?
            const query = `SELECT AVG(item.price) AS avg_price FROM server.store.stores AS s UNNEST s.store_items AS item WHERE item.product_id = "${req.params.id}"`;
            const avg_price = await db.getScope().query(query, (err, result) => err ? err : result);
            if (avg_price.error) res.status(404).json({ message: 'cannot calculate avg price' });

            product.content.avg_price = avg_price.rows[0].avg_price ?? "N/A";
            product.total = 1;
            res.status(200).json(product);
        } catch (err) {
            next(err);
        }
    },

    getByDistance: async (req, res, next) => {
        const page = req.query.page || 1;
        const customer_id = req.query.customer_id;
        const distance = req.query.distance || 10;


        const col = db.getCollection("users");
        const user = await col.get(customer_id).then((result) => result).catch((err) => err);
        if (user.error) return res.status(404).json({ message: "User not found" });
        const [lat, lon] = [user.content.location.coordinates.latitude, user.content.location.coordinates.longitude];

        const stores = await check_if_point_lies_within_circle(lat, lon, distance * 100);
        if (stores.error) return res.status(404).json({ message: "No stores found" }); // TODO: return empty array
        const store_ids = stores["data"]["hits"].map((x) => x.id);
        console.log("stores", stores);

        const sto = db.getCollection("stores");
        let product_ids = [];

        for (const store_id of store_ids) {
            const store = await sto.get(store_id).then((result) => result).catch((err) => err);
            if (store.error) return res.status(404).json({ message: "Store not found" });
            product_ids = [...product_ids, ...store.content.store_items.map((x) => x.product_id)];
        }

        const prd = db.getCollection("products");
        const products = [];
        for (const product_id of product_ids) {
            const product = await prd.get(product_id).then((result) => result).catch((err) => err);
            if (product.error) return res.status(404).json({ message: "Product not found" });
            products.push({
                product: product.content,
            });
        }

        const total = stores["data"]["total_hits"];

        const response = {
            page: page,
            total: total,
            rows: products.slice(0, 10)
        }

        res.status(200).json(response);
    },

    getByFTS: async (req, res, next) => {
        const search_query = req.query.q;
        const page = req.query.page || 1;
        const clu = await db.getCluster();
        console.log("Page", page);
        const OFFSET = (page - 1) * 10;


        const qp = couchbase.SearchQuery.disjuncts(
            couchbase.SearchQuery.match(search_query).field("product_category"),
            couchbase.SearchQuery.match(search_query).field("product_title")
        );

        try {
            const indexName = "productFTS";
            const results = await clu.searchQuery(indexName, qp, { limit: 10, skip: OFFSET }).then((result) => result).catch((err) => err);
            if (results.error) res.status(200).json({ data: { rows: [] } });

            const total = results.meta.metrics.total_rows;


            const product_ids = results.rows.map((row) => row.id);

            if (total === 0) return res.status(200).json({ data: { rows: [] } });
            if (page > Math.ceil(total / 10)) return res.status(404).json({ message: "Page not found" });


            console.log("product_ids", product_ids);
            const col = db.getCollection("products");
            const products = await product_ids.map((id) => col.get(id).then((result) => result).catch((err) => err));


            await Promise.all(products).then((values) => {
                const res_products = {
                    total: Math.ceil(total / 10),
                    rows: values.map((row) => { return { product: row.value } }),
                }
                console.log("res_products", res_products);
                res.status(200).json(res_products);
            }).catch(() => res.status(404).json({ message: "Error getting products" }));


        } catch (err) {
            next(err);
        }
    },

    getStoresByProductId: async (req, res, next) => {
        const productId = req.params.id;
        console.log("Get stores by product id", productId);
        try {
            const query = "SELECT s.store_id AS store_id, s.name AS store_name, s.location AS store_location, s.contact AS store_contact \
              FROM server.store.stores AS s \
              WHERE ANY item IN store_items SATISFIES item.product_id = '" + productId + "' END";
            console.log("query", query);
            const scope = db.getScope();
            await scope.query(query, (err, result) => err ? err : result)
                .then((result) => {
                    res.status(200).json(result);
                }
                ).catch((err) => {
                    res.status(404).json({ message: 'product not found' });
                }
                );
        }
        catch (err) {
            next(err);
        }
    },
    addReview: async (req, res, next) => {
        const { review_headline, review_body, star_rating, user_id } = req.body;
        const productId = req.params.id;

        // TODO: Super shady fix (specially considering the Listing page), look into alternatives
        // https://docs.couchbase.com/php-sdk/current/concept-docs/documents.html#counters
        // https://github.com/twitter-archive/snowflake
        // Maybe they could have the same, since we're only adding a few and no routing is done by the id

        function generateId() {
            const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            let id = '';
            for (let i = 0; i < 14; i++) {
                const randomIndex = Math.floor(Math.random() * characters.length);
                id += characters.charAt(randomIndex);
            }
            return id;
        }
        const new_review_id = generateId();

        const user = await Customer.findById(user_id).then((result) => result.content.name).catch(() => {
            res.status(404).json({ message: 'user not found' });
        });


        const date = new Date();
        const new_review_date = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
        const new_review = {
            review_id: new_review_id,
            customer_id: user_id,
            star_rating: parseInt(star_rating),
            helpful_votes: 0,
            total_votes: 0,
            vine: "N",
            verified_purchase: "Y",
            review_headline: review_headline,
            review_body: review_body,
            review_date: new_review_date,
            customer_name: user
        }


        const user_review_pair = {
            product_id: productId,
            review_id: new_review_id
        };

        console.log(db.getCluster());

        const user_collection = db.getCollection("users");
        const product_collection = db.getCollection("products");

        await db.getCluster().transactions().run(async (ctx) => {

            /* TODO: Check this and see if transaction level is necessary
             * When using a single node cluster (for example, during development),
             * the default number of replicas for a newly created bucket is 1. 
             * If left at this default, all key-value writes performed with durability 
             * will fail with a DurabilityImpossibleError*/

            const user = await ctx.get(user_collection, user_id);

            if (!user) throw new Error("User not found");

            console.log("user", user.content.products_reviews_pairs);
            console.log("productId", productId);
            // check if user already reviewed the product
            const already_reviewed = user.content.products_reviews_pairs.some(
                (pair) => pair.product_id === productId);

            console.log("already_reviewed", already_reviewed);
            if (already_reviewed) throw new Error("User already reviewed the product");

            const new_user = {
                ...user.content,
                products_reviews_pairs: user.content.products_reviews_pairs.concat(
                    [{ product_id: productId, review_id: new_review_id }])
            }
            console.log("new_user", new_user);
            await ctx.replace(user, new_user);


            const product = await ctx.get(product_collection, productId);

            if (!product) throw new Error("Product not found");

            const new_product = {
                ...product.content,
                reviews: product.content.reviews.concat([new_review])
            }
            await ctx.replace(product, new_product);
        }).then((result) => {
            res.status(200).json({ message: 'review added' });
            console.log("Transaction result", result);
        })
            .catch((err) => {
                console.log("Error in addReview", err);
                res.status(404).json({ message: 'product not found' });
            });

        // TODO: compare alternatives

        //  // TODO: fix it and check if easier is possible
        //  const update_user_query = "UPDATE server.store.users AS c SET c.reviews = ARRAY_APPEND(c.reviews, " + JSON.stringify(user_review_pair) + ") WHERE c.customer_id = '" + user_id + "';";
        //  const query = "UPDATE server.store.products AS p SET p.reviews = ARRAY_APPEND(p.reviews, " + JSON.stringify(new_review) + ") WHERE p.product_id = '" + parseInt(productId) + "';";
        //  
        //  // merge both into a single transaction
        //  // ele não gosta disto "SET TRANSACTION ISOLATION LEVEL READ COMMITTED;\n" e "SAVEPOINT sv1", mas era fixe ter
        //  const transaction = `BEGIN WORK; ${update_user_query} ${query} COMMIT WORK;`;

        //  console.log("transaction", transaction);
        //  const scope = db.getScope();
        //  const insertReview = await new Promise((resolve, reject) => {
        //      scope.query(transaction, (err, result) => err ? err : result).
        //          then((result) => {
        //              console.log("result", result);
        //              resolve(result);
        //          }).catch((err) => {
        //              console.log("err", err);
        //              reject(err);
        //          });
        //  })
    },

    /*
    create: async (req, res, next) => {
      try {
        const customer = await Store.create(req.body);
        res.status(201).json(book);
      } catch (err) {
        next(err);
      }
    },
  
  
    update: async (req, res, next) => {
      try {
        const store = await Store.update(req.params.id, req.body);
        if (!store) {
          res.status(404).json({ message: 'store not found' });
        } else {
          res.json(store);
        }
      } catch (err) {
        next(err);
      }
    },
  
    delete: async (req, res, next) => {
      try {
        const result = await Store.delete(req.params.id);
        if (result.cas) {
          res.sendStatus(204);
        } else {
          res.status(404).json({ message: 'store not found' });
        
      } catch (err) {
        next(err);
      }
    }
    */
};


module.exports = productController;
