import json
import pandas as pd
import numpy as np
from faker import Faker
import hashlib
fake = Faker()


JSON_PATH = './datasets/json/products.json'
OUTPUT_FILE = './datasets/json/users.json'


def create_email(username):
    return username + '@gmail.com'


def create_name():
    return fake.name()


def create_fake_username():
    return fake.user_name()


def create_password():
    return hashlib.sha256(b"password").hexdigest()


def create_fake_location():
    return {'city': fake.city(),
            'state': fake.state(),
            'country': fake.country(),
            'zip_code': fake.zipcode(),
            'coordinates': {
                'latitude':float( fake.latitude()),
                'longitude': float(fake.longitude())
            }}


def create_fake_info():
    name = create_name()
    return {'name': name,
            'email': create_email(name),
            'password': create_password(),
            'phone_number': fake.phone_number()}


def create_dataframe(products_df, customer_df):
    customer_df = pd.DataFrame(columns=['customer_id', 'name', 'email',
                                        'password', 'location', 'phone_number',
                                        'products_reviews_pairs'])
    for _, row in products_df.iterrows():
        for review in row['reviews']:
            customer_id = review['customer_id']
            if customer_id in customer_df['customer_id'].values:
                reviews_pairs = customer_df.loc[customer_df['customer_id'] == customer_id]['products_reviews_pairs']
                reviews_pairs = np.append(reviews_pairs.to_numpy(), [{'product_id': row['product_id'], 'review_id': review['review_id']}])
                customer_df.loc[customer_df['customer_id'] == customer_id, 'products_reviews_pairs'] = pd.Series(reviews_pairs)
            else:
                info = create_fake_info()
                info['location'] = create_fake_location()
                info['customer_id'] = customer_id
                info['products_reviews_pairs'] = np.array([{'product_id': row['product_id'], 'review_id': review['review_id']}])
                customer_df.loc[len(customer_df)] = info
                print(info['location'])
                customer_df.loc[customer_df['customer_id'] == customer_id, 'location'] = json.dumps(info['location'])

    return customer_df


if __name__ == '__main__':
    products_df = pd.read_json(JSON_PATH)
    customer_df = pd.DataFrame(columns=['id', 'name', 'email', 'password',
                                        'products_reviews_pairs'])
    df = create_dataframe(products_df, customer_df)

    print("Created users with " + str(len(df)) + " entries")
    df['location'] = df['location'].apply(lambda x: json.loads(x))
    df.to_json(OUTPUT_FILE, lines=True, orient='records')

