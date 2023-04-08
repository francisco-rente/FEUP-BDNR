import pandas
import random
import json


def read_products(filename: str) -> pandas.DataFrame: 
    return pandas.read_json('./datasets/json/{filename}'.format(filename=filename))['product_id']

def read_stores() -> pandas.DataFrame:
    _df =  pandas.read_json('./datasets/json/stores.json', orient='records')
    print(_df)
    return _df.to_dict('records')


def pair(stores, products, noProducts=20) -> pandas.DataFrame:
    for store in stores: 
       store['store_items'] = []
       number_of_products = random.randint(0, noProducts)
       products_ids = products.sample(n=number_of_products, replace=False).to_list()

       for product in products_ids:
           store['store_items'].append({
                    'product_id': product,
                    'price': random.randint(0, 500), 
                    'quantity': random.randint(0, 100)
           })
    return stores

def main(): 
    file = "wireless.json"
    products = read_products(file)
    stores = read_stores()
    stores = pair(stores, products, 20)
    with open('./datasets/json/pair_products_with_stores.json', 'w') as outfile:
        json.dump(stores, outfile)


if __name__ == '__main__':
    main()
