from pymongo import MongoClient
from auth import hash_password, DEFAULT_USERS

MONGO_URI = "mongodb://localhost:27017/"
DB_NAME = "tadjmeel_clinic"

client = MongoClient(MONGO_URI)
db = client[DB_NAME]
users_col = db["users"]

for user in DEFAULT_USERS:
    if not users_col.find_one({"username": user["username"]}):
        users_col.insert_one(user)
        print(f"Added user: {user['username']}")
    else:
        print(f"User already exists: {user['username']}")
