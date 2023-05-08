const Customer = require("../models/customer");
const Product = require("../models/product");

const db = require("../db/database");



const productController = {
  getAll: async (req, res, next) => {
    try {
      console.log("params", req.query);
      const distance = req.query.product_distance.split(",").map((x) => +x);
      const quantity = req.query.product_quantity.split(",").map((x) => +x);
      const price = req.query.product_price.split(",").map((x) => +x);

      // TODO: add distance to query
      const query = `SELECT * FROM server.store.products AS product WHERE product.product_id IN (SELECT RAW item.product_id FROM server.store.stores AS s UNNEST s.store_items AS item
          WHERE item.price BETWEEN ${price[0]} AND ${price[1]} AND item.quantity BETWEEN ${quantity[0]} AND ${quantity[1]})
          LIMIT 10
          `;

      console.log("query", query);

      const scope = db.getScope();
      const products = await scope.query(query, (err, result) => {
        if (err) {
          console.log("Error in Store.findAll");
          return err;
        } else {
          console.log("Store.findAll");
          console.log("result", result);
          return result;
        }
      });
      
      res.status(200).json(products);
    } catch (err) {
      next(err);
    }
  },
  getById: async (req, res, next) => {
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
        res.status(200).json(product);
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
        console.log("params", req.body);
        const { review_headline, review_body, star_rating, user_id } = req.body;
        const productId = req.params.id;
        console.log("Add review", productId);
        console.log(req.body);



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
        console.log("user", user);

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
        console.log("new_review", new_review);
        console.log("new_review", JSON.stringify(new_review));
        console.log("productId", productId);

        const user_review_pair = {
            product_id: productId,
            review_id: new_review_id
        }; 
        

        await db.getBucket().transaction().run(async (ctx) => {
            await ctx.upsert(`user::${user_id}`, {
                reviews: [user_review_pair]
            });
            await ctx.upsert(`product::${productId}`, {
                reviews: [new_review]
            });
        }).catch((err) => {
            console.log("Error in addReview", err);
            res.status(404).json({ message: 'product not found' });
        });



      //  // TODO: check if easier is possible
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

        insertReview.error ?  
            res.status(404).json({ message: 'product not found' }) 
            : res.status(200).json({ message: 'review added' });
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
