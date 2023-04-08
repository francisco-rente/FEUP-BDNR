import json
import random
import string

store_names = ['Fashion Avenue', 'Tech Outlet', 'Fresh Grocers', 'Home Goods', 'Pet Palace', 'Beauty Emporium',
               'Sports Center', 'Book Nook', 'Gourmet Foods', 'Toy Box', 'Office Supplies', 'Gift Gallery',
               'Jewelry Box', 'Music World', 'Party Supplies', 'Outdoor Adventures', 'Tools & Hardware',
               'Crafty Corner', 'Artistic Endeavors', 'Baby Boutique', 'Car Parts', 'Discount Outlet',
               'Electronics Emporium', 'Furniture Gallery', 'Garden Oasis', 'Health & Wellness', 'Kitchen Essentials',
               'Liquor World', 'Maternity Wear', 'Nutrition Shop', 'Outdoor Living', 'Photo Shop', 'Seasonal Celebrations',
               'Travel Gear', 'Underground Comics', 'Vintage Finds', 'Watches & Accessories', 'Youth Culture',
               'Bath & Body Works', 'Comic Book Store', 'Designer Boutique', 'Eco-Friendly Living', 'Fashion Forward',
                'Gaming Hub', 'Hobby Shop', 'Interior Design', 'Juice Bar', 'Kitchen & Bath', 'Lingerie Store'
                'Men\'s Wearhouse', 'Natural Foods', 'Outdoor Gear', 'Pet Supplies', 'Quilting Supplies', 'Retro Clothing',
               ]
def main():
    store_locations = []
    for i in range(50):
        latitude = round(random.uniform(-90, 90), 6)
        longitude = round(random.uniform(-180, 180), 6)
        altitude = round(random.uniform(0, 5000), 2)
        store_locations.append({'latitude': latitude, 'longitude': longitude, 'altitude': altitude})
    
    store_contacts = []
    for i in range(50):
        phone_number = ''.join(random.choices(string.digits, k=10))
        store_name = store_names[i].replace(' ', '')
        email = f'{store_name}@example.com'
        store_contacts.append({'phone_number': phone_number, 'email': email})
    
    stores = []
    for i in range(50):
        store = {'name': store_names[i], 'location': store_locations[i], 'contact': store_contacts[i]}
        stores.append(store)


    stores_json = json.dumps(stores, indent=4)
    with open('./datasets/json/stores.json', 'w') as f:
        f.write(stores_json)

if __name__ == '__main__':
    main()























