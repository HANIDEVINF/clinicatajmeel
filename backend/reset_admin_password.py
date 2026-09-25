from pymongo import MongoClient
from auth import hash_password

MONGO_URI = 'mongodb://localhost:27017/'
DB_NAME = 'tadjmeel_clinic'

client = MongoClient(MONGO_URI)
db = client[DB_NAME]
users_col = db['users']

new_password = 'admin2026'
hashed_password = hash_password(new_password)
result = users_col.update_one(
    {'username': 'admin'},
    {'$set': {'password': hashed_password}}
)

if result.modified_count > 0:
    print('Admin password reset successfully')
else:
    print('Admin password was not modified (maybe it was already set to this value?)')
