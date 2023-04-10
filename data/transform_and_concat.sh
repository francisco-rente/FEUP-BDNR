#!/bin/zsh

FINAL_FILE_NAME="products.json"
 
data_dir=./datasets/source

for entry in "$data_dir"/*
do
  FILE_NAME=$(basename "$entry")
  python3 transform.py $FILE_NAME
done

OUTPUT=./datasets/json
if [ -f "$OUTPUT/$FINAL_FILE_NAME" ]; then
  rm "$OUTPUT/$FINAL_FILE_NAME"
fi

files=`ls $OUTPUT/*.json`  # | tr
echo $files
print $files | xargs jq ".[]" -s > "datasets/json/$FINAL_FILE_NAME"



