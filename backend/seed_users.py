"""Creates the default login accounts in MongoDB (run once, from the backend folder)."""
from pymongo import MongoClient
from auth import DEFAULT_USERS

MONGO_URI = "mongodb://localhost:27017/"
DB_NAME = "tadjmeel_clinic"

client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=3000)
client.server_info()  # fails fast with a clear error if MongoDB is not running
users_col = client[DB_NAME]["users"]

for user in DEFAULT_USERS:
    if not users_col.find_one({"username": user["username"]}):
        users_col.insert_one(dict(user))
        print(f"Added user: {user['username']}")
    else:
        print(f"User already exists: {user['username']}")
