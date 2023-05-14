const Customer = require("../models/customer");
const Product = require("../models/product");

const db = require("../db/database");

const NUM_PRODUCTS_PER_PAGE = 10;

const productController = {
    getAll: async (req, res, next) => {
        try {
            const distance = req.query.product_distance.split(",").map((x) => +x);
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
            if(product_count.error) res.status(404).json({ message: 'cannot calculate total products' });
            
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

            product.content.avg_rating = 3.5;
            product.total = 1;
            res.status(200).json(product);
        } catch (err) {
            next(err);
        }
    },

  getByFTS: async (req, res, next) => {
    const input = req.params.query;

    console.log("inside getByFTS");
    console.log("input", input);

    try {
      const indexName = "product_fts";
      await db.getCluster().searchQuery(
          indexName,
          couchbase.SearchQuery.matchPhrase(input),
          { limit: 10 }
        ).then((result) => {
          res.status(200).json(result);
        }
        ).catch((err) => {
          res.status(404).json({ message: 'No products match query' });
        });
    } catch (err) {
      next(err);
    }},

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
            res.status(404).json({ message: 'user not found' });});


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
                products_reviews_pairs : user.content.products_reviews_pairs.concat(
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
