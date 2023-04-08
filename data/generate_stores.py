import json
import random
import string

store_names = ["Aldi", "Walmart", "Carrefour", "Kroger", "Lidl", "Tesco", "Target", "Sainsbury's", "Costco", "Asda", "Metro", "Coop", "Safeway", "Morrisons", "SuperValu", "Auchan", "Emart", "Biedronka", "Netto", "Lotte Mart", "Edeka", "Migros", "Giant", "AEON", "Casino", "Sheng Siong", "Lianhua", "Dia", "Maxima", "Ralphs", "Géant Casino", "Food Lion", "Whole Foods Market", "Bi-Lo", "HEB", "Piggly Wiggly", "WinCo Foods", "Sprouts Farmers Market", "Food 4 Less", "Vons", "Publix", "Meijer", "La Placita", "Super C", "Price Chopper", "Giant Eagle", "FreshCo", "Gristedes", "Food Basics", "City Market"]         

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























