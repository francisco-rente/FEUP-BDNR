import json
import requests
import random
import string

store_names = ["Aldi", "Walmart", "Carrefour", "Kroger", "Lidl", "Tesco", "Target", "Sainsbury's", "Costco", "Asda", "Metro", "Coop", "Safeway", "Morrisons", "SuperValu", "Auchan", "Emart", "Biedronka", "Netto", "Lotte Mart", "Edeka", "Migros", "Giant", "AEON", "Casino", "Sheng Siong", "Lianhua", "Dia", "Maxima", "Ralphs", "Géant Casino", "Food Lion", "Whole Foods Market", "Bi-Lo", "HEB", "Piggly Wiggly", "WinCo Foods", "Sprouts Farmers Market", "Food 4 Less", "Vons", "Publix", "Meijer", "La Placita", "Super C", "Price Chopper", "Giant Eagle", "FreshCo", "Gristedes", "Food Basics", "City Market"]

locations = [
    {"city": "Tokyo", "country": "Japan", "latitude": 35.6895, "longitude": 139.6917},
    {"city": "New York", "country": "United States", "latitude": 40.7128, "longitude": -74.0060},
    {"city": "São Paulo", "country": "Brazil", "latitude": -23.5505, "longitude": -46.6333},
    {"city": "Mumbai", "country": "India", "latitude": 19.0760, "longitude": 72.8777},
    {"city": "Moscow", "country": "Russia", "latitude": 55.7558, "longitude": 37.6173},
    {"city": "London", "country": "United Kingdom", "latitude": 51.5074, "longitude": -0.1278},
    {"city": "Paris", "country": "France", "latitude": 48.8566, "longitude": 2.3522},
    {"city": "Bangkok", "country": "Thailand", "latitude": 13.7563, "longitude": 100.5018},
    {"city": "Seoul", "country": "South Korea", "latitude": 37.5665, "longitude": 126.9780},
    {"city": "Istanbul", "country": "Turkey", "latitude": 41.0082, "longitude": 28.9784},
    {"city": "Lagos", "country": "Nigeria", "latitude": 6.5244, "longitude": 3.3792},
    {"city": "Buenos Aires", "country": "Argentina", "latitude": -34.6037, "longitude": -58.3816},
    {"city": "Shanghai", "country": "China", "latitude": 31.2304, "longitude": 121.4737},
    {"city": "Karachi", "country": "Pakistan", "latitude": 24.8607, "longitude": 67.0011},
    {"city": "Madrid", "country": "Spain", "latitude": 40.4168, "longitude": -3.7038},
    {"city": "Cairo", "country": "Egypt", "latitude": 30.0444, "longitude": 31.2357},
    {"city": "Rio de Janeiro", "country": "Brazil", "latitude": -22.9068, "longitude": -43.1729},
    {"city": "Lima", "country": "Peru", "latitude": -12.0464, "longitude": -77.0428},
    {"city": "Chicago", "country": "United States", "latitude": 41.8781, "longitude": -87.6298},
    {"city": "Tehran", "country": "Iran", "latitude": 35.6892, "longitude": 51.3890},
    {"city": "Bogotá", "country": "Colombia", "latitude": 4.7109, "longitude": -74.0721},
    {"city": "Lahore", "country": "Pakistan", "latitude": 31.5820, "longitude": 74.3294},
    {"city": "Kinshasa", "country": "Democratic Republic of the Congo", "latitude": -4.4419, "longitude": 15.2663},
    {"city": "Delhi", "country": "India", "latitude": 28.7041, "longitude": 77.1025},
    {"city": "Tianjin", "country": "China", "latitude": 39.3054, "longitude": 117.3230},
    {"city": "Jakarta", "country": "Indonesia", "latitude": -6.2146, "longitude": 106.8451},
    {"city": "Guangzhou", "country": "China", "latitude": 23.1291, "longitude": 113.2644},
    {"city": "Shenzhen", "country": "China", "latitude": 22.5431, "longitude": 114.0579},
    {"city": "Chennai", "country": "India", "latitude": 13.0827, "longitude": 80.2707},
    {"city": "Dhaka", "country": "Bangladesh", "latitude": 23.8103, "longitude": 90.4125},
    {"city": "Beijing", "country": "China", "latitude": 39.9042, "longitude": 116.4074},
    {"city": "Kolkata", "country": "India", "latitude": 22.5726, "longitude": 88.3639},
    {"city": "Los Angeles", "country": "United States", "latitude": 34.0522, "longitude": -118.2437},
    {"city": "Lahore", "country": "Pakistan", "latitude": 31.5820, "longitude": 74.3294},
    {"city": "Shenyang", "country": "China", "latitude": 41.8057, "longitude": 123.4315},
    {"city": "Wuhan", "country": "China", "latitude": 30.5928, "longitude": 114.3055},
    {"city": "Bengaluru", "country": "India", "latitude": 12.9716, "longitude": 77.5946},
    {"city": "Ho Chi Minh City", "country": "Vietnam", "latitude": 10.8231, "longitude": 106.6297},
    {"city": "Hyderabad", "country": "India", "latitude": 17.3850, "longitude": 78.4867},
    {"city": "Ahmedabad", "country": "India", "latitude": 23.0225, "longitude": 72.5714},
    {"city": "Hong Kong", "country": "Hong Kong", "latitude": 22.3964, "longitude": 114.1095},
    {"city": "Chongqing", "country": "China", "latitude": 29.5628, "longitude": 106.5528},
    {"city": "Chengdu", "country": "China", "latitude": 30.6672, "longitude": 104.0648},
    {"city": "Baghdad", "country": "Iraq", "latitude": 33.3406, "longitude": 44.4009},
    {"city": "Riyadh", "country": "Saudi Arabia", "latitude": 24.7136, "longitude": 46.6753},
    {"city": "London", "country": "United Kingdom", "latitude": 51.5074, "longitude": -0.1278},
    {"city": "Bangkok", "country": "Thailand", "latitude": 13.7563, "longitude": 100.5018},
    {"city": "Chittagong", "country": "Bangladesh", "latitude": 22.3569, "longitude": 91.7832},
    {"city": "Istanbul", "country": "Turkey", "latitude": 41.0082, "longitude": 28.9784},
    {"city": "Lisbon", "country": "Portugal", "latitude": 38.7223, "longitude": -9.1393},
    {"city": "Toronto", "country": "Canada", "latitude": 43.6532, "longitude": -79.3832},
    {"city": "Buenos Aires", "country": "Argentina", "latitude": -34.6037, "longitude": -58.3816},
    {"city": "Moscow", "country": "Russia", "latitude": 55.7558, "longitude": 37.6173},
    ]


def get_location_from_openstreetmap(city):
    city = city.replace(' ', '+')
    req = requests.get(f'https://nominatim.openstreetmap.org/search?q={city}&format=jsonv2')
    if req.status_code == 200:
        data = req.json()
        if data:
            return data[0]['lat'], data[0]['lon']
    return None, None


def create_random_location():
    return {
        'latitude': round(random.uniform(-90, 90), 6),
        'longitude': round(random.uniform(-180, 180), 6),
        'altitude': round(random.uniform(0, 5000), 2)
    }


def create_location(index):
    return {
        'latitude': locations[index]['latitude'],
        'longitude': locations[index]['longitude'],
        'altitude': round(random.uniform(0, 5000), 2),
        'city': locations[index]['city'],
        'country': locations[index]['country'],
    }


def create_contact(store_name):
    return {
        'phone_number': ''.join(random.choices(string.digits, k=10)),
        'email': f'{store_name.replace(" ", "")}@example.com'
    }


def create_store(store_name, index):
    store = {}
    store['store_id'] = index + 1
    store['name'] = store_name
    store['location'] = create_location(index)
    store['contact'] = create_contact(store_name)
    return store


def main():
    stores = [create_store(store_name, index)
              for index, store_name in enumerate(store_names)]
    stores_json = json.dumps(stores, indent=4)
    with open('./datasets/json/stores.json', 'w') as f:
        f.write(stores_json)


if __name__ == '__main__':
    main()
