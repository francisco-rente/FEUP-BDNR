import tensorflow_datasets as tfds
import os
import sys
import functools
import operator

DATASETS_V1_00 = [
            "Wireless",
            "Watches",
            "Video_Games",
            "Video_DVD",
            "Video",
            "Toys",
            "Tools",
            "Sports",
            "Software",
            "Shoes",
            "Pet_Products",
            "Personal_Care_Appliances",
            "PC",
            "Outdoors",
            "Office_Products",
            "Musical_Instruments",
            "Music",
            "Mobile_Electronics",
            "Mobile_Apps",
            "Major_Appliances",
            "Luggage",
            "Lawn_and_Garden",
            "Kitchen",
            "Jewelry",
            "Home_Improvement",
            "Home_Entertainment",
            "Home",
            "Health_Personal_Care",
            "Grocery",
            "Gift_Card",
            "Furniture",
            "Electronics",
            "Digital_Video_Games",
            "Digital_Video_Download",
            "Digital_Software",
            "Digital_Music_Purchase",
            "Digital_Ebook_Purchase",
            "Camera",
            "Books",
            "Beauty",
            "Baby",
            "Automotive",
            "Apparel",
            ]

DATASETS_V1_01 = ["Digital_Ebook_Purchase", "Books"]
DATASETS_V1_02 = ["Books"]


dataset_list = {
    "v1_00": DATASETS_V1_00,
    "v1_01": DATASETS_V1_01,
    "v1_02": DATASETS_V1_02
        }


def build_url(dataset, version="v1_00"):
    return f"https://s3.amazonaws.com/amazon-reviews-pds/tsv/amazon_reviews_us_{dataset}_{version}.tsv.gz"


def download_dataset(dataset):
    version = [k for k, v in dataset_list.items() if dataset in v][0]
    url = build_url(dataset, version)

    if not os.path.exists("./datasets/source/"):
        os.makedirs("./datasets/source/")

    res = tfds.download.Resource(url=url, path="./datasets/source/{dataset}.tsv.gz".format(dataset=dataset))

    print("Downloading dataset from: ", url)
    dm = tfds.download.DownloadManager(download_dir="./datasets/source/", extract_dir="./datasets/source/")
    dm.download_and_extract(res)

def delete_downloaded_file(type, identifier):
    file = [f for f in os.listdir("./datasets/source/") if f.endswith(type) and identifier in f][0]
    print("Deleting file: ", file)
    os.remove(os.path.join("./datasets/source/", file))


def rename_downloaded_file(identifier):
    file = [f for f in os.listdir("./datasets/source/") if identifier in f and f.startswith("GZIP")][0]
    print("Renaming file: ", file)
    os.rename(os.path.join("./datasets/source/", file), f"./datasets/source/{dataset_arg}.tsv") 


def main():
    if len(sys.argv) == 0:
        print("Please provide dataset name")
        return

    if len(sys.argv) == 1 and sys.argv[1] == "help":
        print("Available datasets: ")
        for version in dataset_list.keys():
            print(version, ": ", dataset_list[version])
        return
    elif len(sys.argv) > 2:
        print("Too many arguments")
        return

    dataset_arg = sys.argv[1]

    if dataset_arg not in functools.reduce(operator.iconcat,
                                           dataset_list.values(), []):
        print("Invalid dataset name")
        return

    download_dataset(dataset_arg)

if __name__ == "__main__":
    main()

    dataset_arg = sys.argv[1]
    identifier = dataset_arg[0:4]
    print(identifier)

    # "{sanitized_url}{url_checksum}.tmp.{uuid}"

    rename_downloaded_file(identifier) # rename tsv
    delete_downloaded_file(".INFO", identifier) # remove INFO
    delete_downloaded_file(".gz", identifier) # remove zip   
