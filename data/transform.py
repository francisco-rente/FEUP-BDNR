import pandas as pd
import os
import sys

SOURCE_PATH = './datasets/source/'
JSON_PATH = './datasets/json/'


def revert_objects(df):
    new_df = pd.DataFrame(columns=['product_id', 'product_title', 'product_category', 'product_parent', 'marketplace', 'reviews'])

    for row in df.iterrows():
        product_id = row[1]['product_id']

        # verify if product_id is already in the new_df
        if product_id not in new_df['product_id'].values:
            product_title = row[1]['product_title']
            product_category = row[1]['product_category']
            product_parent = row[1]['product_parent']
            marketplace = row[1]['marketplace']
            reviews = []
            new_df.loc[len(new_df)] = [product_id,
                                       product_title,
                                       product_category,
                                       product_parent,
                                       marketplace,
                                       reviews]

        # add review json to the product row
        review = {
            "review_id": row[1]['review_id'],
            "customer_id": row[1]['customer_id'],
            "star_rating": row[1]['star_rating'],
            "helpful_votes": row[1]['helpful_votes'],
            "total_votes": row[1]['total_votes'],
            "vine": row[1]['vine'],
            "verified_purchase": row[1]['verified_purchase'],
            "review_headline": row[1]['review_headline'],
            "review_body": row[1]['review_body'],
            "review_date": row[1]['review_date']
        }

        new_df.loc[new_df['product_id'] == product_id, 'reviews'].apply(
                lambda x: x.append(review))

    return new_df


def transform_to_json(dataset):
    df = pd.read_csv(SOURCE_PATH + dataset, sep='\t',
                     on_bad_lines='skip', chunksize=100)  # Get iterator
    print("READ TSV")
    df = next(df)

    print("Products with more than 1 review",
          df.duplicated(subset=['product_id']).sum())
    print("IDS", df[df.duplicated(subset=['product_id'])]['product_id'].values)

    new_df = revert_objects(df)

    print("WRITE JSON")
    dataset = dataset.replace('.tsv', '.json')
    new_df.to_json(JSON_PATH + dataset, index=True, orient='records')


def main():
    if len(sys.argv) != 1:
        print('Usage: python transform.py <dataset>')

    dataset = sys.argv[1]

    if not os.path.exists(SOURCE_PATH + dataset):
        print('Dataset not found')
        exit(1)

    if not os.path.exists(JSON_PATH):
        os.makedirs(JSON_PATH)

    transform_to_json(dataset)


if __name__ == '__main__':
    main()
