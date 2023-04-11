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
files=`echo $files | sed 's/\.\/datasets\/json\/stores\.json//g'`
echo $files
# https://stackoverflow.com/questions/42011086/merge-arrays-of-json
print $files | xargs jq "add" -s > "datasets/json/$FINAL_FILE_NAME" #



