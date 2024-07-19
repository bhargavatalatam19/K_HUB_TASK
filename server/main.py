from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from fastapi.encoders import jsonable_encoder
from motor.motor_asyncio import AsyncIOMotorClient
from bson.objectid import ObjectId
import hashlib
import jwt

# Constants
SECRET_KEY = "cairocoders123456789"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 800

# MongoDB connection string
MONGO_DETAILS = "mongodb://localhost:27017"

# Initialize MongoDB client
client = AsyncIOMotorClient(MONGO_DETAILS)
database = client.user_database
user_collection = database.get_collection("users")
notes_collection = database.get_collection("notes")

# Initialize FastAPI app
app = FastAPI()

# CORS middleware
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
    allow_credentials=True,
    allow_origins=["http://localhost:3000"]
)

# Pydantic models
class LoginClass(BaseModel):
    username: str
    password: str

class RegistrationForm(BaseModel):
    username: str
    email: str
    password: str
    full_name: str | None = None

class NoteModel(BaseModel):
    title: str
    content: str

# Utility functions
def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

async def get_user_by_username(username: str):
    user = await user_collection.find_one({"username": username})
    return user

async def get_user_by_email(email: str):
    user = await user_collection.find_one({"email": email})
    return user

# API Endpoints
@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.post("/login")
async def login_user(login_item: LoginClass):
    data = jsonable_encoder(login_item)
    user = await get_user_by_username(data['username'])
    if user and user['hashed_password'] == hash_password(data['password']):
        encoded_jwt = jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)
        return {'token': encoded_jwt}
    else:
        # raise HTTPException(status_code=400, detail="Incorrect username or password")
        return {'message':'loginfail'}
@app.post("/register")
async def register_user(registration_form: RegistrationForm):
    data = jsonable_encoder(registration_form)
    if await get_user_by_username(data['username']):
        raise HTTPException(status_code=400, detail="Username already exists")
    if await get_user_by_email(data['email']):
        raise HTTPException(status_code=400, detail="Email already registered")
       
    
    hashed_password = hash_password(data['password'])
    user_data = {
        'username': data['username'],
        'email': data['email'],
        'full_name': data.get('full_name', ""),
        'hashed_password': hashed_password
    }
    await user_collection.insert_one(user_data)
    return {'message': 'Registration successful'}

@app.post("/notes/", response_model=NoteModel)
async def create_note(note: NoteModel):
    note_dict = note.dict()
    result = await notes_collection.insert_one(note_dict)
    if result.inserted_id:
        return note
    else:
        raise HTTPException(status_code=500, detail="Note creation failed")

@app.get("/notes/")
async def read_notes():
    notes = await notes_collection.find().to_list(length=100)
    for note in notes:
        note["_id"] = str(note["_id"])
    return notes

@app.put("/notes/{note_id}", response_model=NoteModel)
async def update_note(note_id: str, note: NoteModel):
    result = await notes_collection.update_one({"_id": ObjectId(note_id)}, {"$set": note.dict()})
    if result.modified_count == 1:
        return note
    else:
        raise HTTPException(status_code=404, detail="Note not found")

@app.delete("/notes/{note_id}")
async def delete_note(note_id: str):
    result = await notes_collection.delete_one({"_id": ObjectId(note_id)})
    if result.deleted_count == 1:
        return {"message": "Note deleted"}
    else:
        raise HTTPException(status_code=404, detail="Note not found")
