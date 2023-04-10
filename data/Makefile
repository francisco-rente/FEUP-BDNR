SOURCE_DIR = "./datasets/source/"
JSON_DIR = "./datasets/json/"
PRODUCTS = "products.json"

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

transform_products: 
	@mkdir -p $(JSON_DIR)
	@echo "==> Transforming datasets"
	./transform_and_concat.sh
	@echo "==> Transforming datasets done"

generate_stores: 
	@echo "==> Generating stores"
	python3 generate_stores.py
	@echo "==> Generating stores done"

pair_stores: generate_stores tranform_products
	@echo "==> Pairing stores"
	python3 pair_products_with_stores.py $(PRODUCTS) 10
	@echo "==> Pairing stores done"


clean:
	@echo "==> Cleaning datasets"
	@rm -rf $(SOURCE_DIR)
	@echo "==> Cleaning datasets done"
