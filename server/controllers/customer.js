const Customer = require("../models/customer");
const db = require("../db/database");

const customerController = {
  getAll: async (req, res, next) => {
    try {
      const customer = await Customer.findAll();
      res.json(customer);
    } catch (err) {
      next(err);
    }
  },

  getById: async (req, res, next) => {
    try {
      // TODO: collect these queries in a JOIN
      // https://docs.couchbase.com/server/current/n1ql/n1ql-language-reference/join.html#ansi-join-with-arrays-on-both-sides

      const customer = await Customer.findById(parseInt(req.params.id));
      if (!customer) res.status(404).json({ message: "Customer not found" });

      const reviews = customer.content.products_reviews_pairs.map((pair) => {
        return pair.review_id;
      });

      const query = `SELECT p.product_id, p.product_title,r FROM server.store.products AS p UNNEST p.reviews AS r WHERE r.review_id IN ${JSON.stringify(
        reviews
      )}`;
      const scope = db.getScope();
      const data = await scope.query(query, (err, result) =>
        err ? err : result
      );
      if (data.error) res.status(404).json({ message: "Customer not found" });
      console.log("data", data);

      const response = {
        customer: customer.content,
        reviews: data.rows,
      };

      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  },
  login: async (req, res, next) => {
    try {
      const userId = req.body.userId;
      const customer = await Customer.findById(userId);
      if (!customer) res.status(404).json({ message: "Customer not found" });
      res.json(customer);
    } catch (err) {
      next(err);
    }
  },

  /* delete_review: async (req, res, next) =>{
    //extract review_id from request
    review_id = request.args.get('review_id')

    # get the document for the review
    query = QueryString('SELECT * FROM `bucket_name` WHERE review_id = $1')
    rows = cluster.query(query, review_id)

    # check if the review exists
    if len(rows) == 0:
        return {'message': 'Review not found.'}, 404

    review_doc = rows[0]

    # delete the review from the product record
    product_id = review_doc['product_id']
    product_query = QueryString('UPDATE `bucket_name` SET reviews = ARRAY_REMOVE(reviews, OBJECT { "review_id": $1 }) WHERE product_id = $2')
    cluster.query(product_query, review_id, product_id)

    # delete the review from the customer record
    customer_id = review_doc['customer_id']
    customer_query = QueryString('UPDATE `bucket_name` SET products_reviews_pairs = ARRAY_REMOVE(products_reviews_pairs, OBJECT { "review_id": $1 }) WHERE customer_id = $2')
    cluster.query(customer_query, review_id, customer_id)

    # delete the review document
    delete_query = QueryString('DELETE FROM `bucket_name` WHERE review_id = $1')
    cluster.query(delete_query, review_id)

    return {'message': 'Review deleted successfully.'}, 200}
    */

  //deleting a review from a product and customer
    deleteReview: async (req, res, next) => {
        try {
            const product_id = req.body.product_id;
            const customer_id = req.body.customer_id;
            const review_id = req.body.review_id;
            console.log("review_id", review_id, "product_id", product_id, "customer_id", customer_id);
            const query = `UPDATE server.store.products SET reviews = ARRAY v FOR v IN reviews WHEN v.review_id != "${review_id}" END WHERE product_id = "${product_id}"`;
            console.log("query", query);
            const scope = db.getScope();
            const data = await scope.query(query, (err, result) =>
                err ? err : result
            );
            console.log("data", data);
            if (data.error) res.status(404).json({message: "Review not found"});
            const query2 = `UPDATE server.store.users SET  products_reviews_pairs = ARRAY v FOR v IN products_reviews_pairs WHEN v.review_id != "${review_id}" END WHERE customer_id = ${customer_id}`;
            const data2 = await scope.query(query2, (err, result) =>
                err ? err : result
            );
            if (data2.error) res.status(404).json({message: "Review not found"});
        } catch (err) {
            next(err);
        }
    }
};

module.exports = customerController;
