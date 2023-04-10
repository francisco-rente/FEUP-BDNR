#!/bin/zsh

# FINAL_FILE_NAME="products.json"
# 
# data_dir=./datasets/source
# 
# for entry in "$data_dir"/*
# do
#   FILE_NAME=$(basename "$entry")
#   python3 transform.py $FILE_NAME
# done

FILES=./datasets/json/*.json
echo $FILES
#jq ".[]" -s $FILES > datasets/json/$FINAL_FILE_NAME


