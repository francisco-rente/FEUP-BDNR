import json

USER_FILE = './datasets/json/users.json'
PRODUCT_FILE = './datasets/json/products.json'
OUTPUT_FILE = './datasets/json/products_updated.json'


def main():
    with open(USER_FILE, 'r', encoding='utf-8') as f:
        users = json.load(f)

    with open(PRODUCT_FILE, 'r', encoding='utf-8') as f:
        products = json.load(f)

    names = {}
    for d in users:
        names[d['customer_id']] = d['name']

    for d in products:
        for j in d['reviews']:
            if j['customer_id'] in names:
                j['customer_name'] = names[j['customer_id']]

    with open(OUTPUT_FILE, 'w') as f:
        json.dump(products, f)


if __name__ == '__main__':
    main()
