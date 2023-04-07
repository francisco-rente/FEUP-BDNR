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

    if not os.path.exists("./datasets/Source/"):
        os.makedirs("./datasets/Source/")

    print("Downloading dataset from: ", url)
#    dm = tfds.download.DownloadManager(download_dir='./datasets') # , extract_dir='./datasets')
#    dm.download(url)


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
