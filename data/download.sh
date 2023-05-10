#!/bin/bash

while read line; do
    echo "Downloading $line"
    python3 download.py $line #> /dev/null 2>&1
done < chosen_datasets.txt


