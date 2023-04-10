import pandas
import argparse
import os.path
import sys
import random
import json

DEFAULT_FILE = 'wireless.json'
OUTPUT_FILE = './datasets/json/pair_products_with_stores.json'
DEFAULT_NO_PRODUCTS = 20
STORE_SOURCE_FILE = './datasets/json/stores.json'


def read_products(filename: str) -> pandas.DataFrame:
    return pandas.read_json('./datasets/json/{filename}'.format(filename=filename))['product_id']


def read_stores() -> list:
    _df = pandas.read_json(STORE_SOURCE_FILE, orient='records')
    return _df.to_dict('records')


def create_product(product_id: str) -> dict:
    return {
        'product_id': product_id,
        'price': random.randint(0, 500),
        'quantity': random.randint(0, 100)
    }


def setup_store_items(store: dict, products: pandas.DataFrame,
                      noProducts: int) -> dict:
    number_of_products = random.randint(0, noProducts)
    products_ids = products.sample(n=number_of_products,
                                   replace=False).to_list()
    store['store_items'] = [create_product(product) for product in products_ids]
    return store


def pair(stores, products, noProducts=20) -> list:
    return [setup_store_items(store, products, noProducts) for store in stores]


parser = argparse.ArgumentParser(description='Pair products with stores')
parser.add_argument('-f', '--file', type=str, default=DEFAULT_FILE,
                    help='File to read products from')
parser.add_argument('-n', '--no_products', type=int,
                    default=DEFAULT_NO_PRODUCTS,
                    help='MAX number of products to pair with stores')


def parse_args(args, file, no_products) -> tuple:
    args = parser.parse_args(args)
    if args.file:
        file = args.file
    if args.no_products:
        no_products = args.no_products

    return file, no_products


def main():
    file = DEFAULT_FILE
    no_products = DEFAULT_NO_PRODUCTS

    args = args = sys.argv[1:]
    if len(args) > 0:
        file, no_products = parse_args(args, file, no_products)

    if not os.path.exists(STORE_SOURCE_FILE):
        print("File stores.json not found")
        exit(1)

    elif not os.path.exists('./datasets/json/{file}'.format(file=file)):
        print("File {file} not found".format(file=file))
        exit(1)

    products = read_products(file)
    if no_products > len(products):
        print("Number of products is greater than the number of products in the file")
        exit(1)

    stores = read_stores()
    stores = pair(stores, products, no_products)

    with open(OUTPUT_FILE, 'w') as outfile:
        json.dump(stores, outfile)


if __name__ == '__main__':
    main()
