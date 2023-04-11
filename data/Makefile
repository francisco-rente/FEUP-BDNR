SOURCE_DIR = "./datasets/source/"
JSON_DIR = "./datasets/json/"
PRODUCTS = "products.json"

.PHONY: permissions folders

folders:
	@echo "==> Creating folders"
	@mkdir -p $(SOURCE_DIR)
	@mkdir -p $(JSON_DIR)
	@echo "==> Creating folders done"


permissions: 
	@echo "==> Setting permissions"
	@chmod +x download.sh
	@chmod +x transform_and_concat.sh
	@echo "==> Setting permissions done"

download: permissions
	@mkdir -p $(SOURCE_DIR)
	@echo "==> Downloading datasets"
	./download.sh
	@echo "==> Downloading datasets done"

transform_products: download 
	@mkdir -p $(JSON_DIR)
	@echo "==> Transforming datasets"
	./transform_and_concat.sh
	@echo "==> Transforming datasets done"

generate_stores: permissions 
	@echo "==> Generating stores"
	python3 generate_stores.py
	@echo "==> Generating stores done"

pair_stores: generate_stores trasnform_products
	@echo "==> Pairing stores"
	python3 pair_products_with_stores.py -f $(PRODUCTS) -n 30
	@echo "==> Pairing stores done"

all : pair_stores 

clean:
	@echo "==> Cleaning datasets"
	@rm -rf $(SOURCE_DIR)
	@rm -rf $(JSON_DIR)
	@echo "==> Cleaning datasets done"
