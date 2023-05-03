import json

with open('users.json', 'r') as f:
    users = json.load(f)

with open('products.json', 'r') as f:
    products = json.load(f)

names = {}
for d in users:
    names[d['customer_id']] = d['name']


for d in products:
    for j in d['reviews']:
        if j['customer_id'] in names:
            j['customer_name'] = names[j['customer_id']]

with open('products_updated.json', 'w') as f:
    json.dump(products, f)
