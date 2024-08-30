# FEUP-BDNR 

## Description 

A store management system built on top of real-life reviews, using the react, express and node.js frameworks for the application and the NoSQL Couchbase database for the data storage.

## Contributors 

- António Ribeiro ([@francisco-rente](https://github.com/francisco-rente))
- Gabriel Martins ([@Gabm-01](https://github.com/Gabm-01))
- Pedro Pinheiro ([@PPinhas](https://github.com/PPinhas))


## Database schema and available queries

![Database schema](./assets/DB_schema.drawio.png)


## Instructions 

> :warning: **Datasets**: As of this moment the links used to gather the datasets from amazon buckets are not available. As such the data retrieval and processing pipeline in [data](./data/Makefile) is invalid. The datasets are therefore *included* in this repository.

### Docker 

Install docker in your machine. Run the following command to build the docker image:

```
docker build -t test-couchbase .
``` 

Run the following command to start the docker container, after giving the necessary permissions to the script:

```
./run_container.sh
```

You can access the Couchbase Web Console at `http://localhost:8091` with the credentials `admin:password`.



## Some pictures of the application

### Home page
![Home page](./assets/main_page.png)

### Product page
![Product page](./assets/product_page.png)

### Reviews Page
![Reviews page](./assets/reviews.png)

### Stores Page
![Stores page](./assets/stores.png)
 




