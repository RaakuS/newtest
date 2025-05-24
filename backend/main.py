from fastapi import FastAPI, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, Integer, String, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
import os
import uuid
import anthropic

DATABASE_URL = os.getenv('DATABASE_URL', 'sqlite:///./app.db')
ANTHROPIC_API_KEY = os.getenv('ANTHROPIC_API_KEY', '')

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    interests = Column(Text)

class Match(Base):
    __tablename__ = 'matches'
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer)
    match_id = Column(Integer)
    proposal = Column(Text)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class UserCreate(BaseModel):
    username: str
    interests: str

class UserOut(BaseModel):
    id: int
    username: str
    interests: str
    class Config:
        orm_mode = True

app = FastAPI()

Base.metadata.create_all(bind=engine)

client = anthropic.Client(api_key=ANTHROPIC_API_KEY) if ANTHROPIC_API_KEY else None

def get_embedding(text: str):
    if not client:
        return []
    resp = client.embeddings.create(model="claude-v1", input=text)
    return resp['data'][0]['embedding']

@app.post('/signup', response_model=UserOut)
def signup(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    new_user = User(username=user.username, interests=user.interests)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.get('/users/{user_id}', response_model=UserOut)
def read_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).get(user_id)
    if not user:
        raise HTTPException(status_code=404, detail='User not found')
    return user

@app.post('/match/{user_id}')
def matchmake(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).get(user_id)
    if not user:
        raise HTTPException(status_code=404, detail='User not found')
    users = db.query(User).filter(User.id != user_id).all()
    if not client:
        return {"matches": []}
    user_embedding = get_embedding(user.interests)
    matches = []
    for u in users:
        other_embedding = get_embedding(u.interests)
        # simple cosine similarity
        if user_embedding and other_embedding:
            dot = sum(a*b for a,b in zip(user_embedding, other_embedding))
            norm_a = sum(a*a for a in user_embedding) ** 0.5
            norm_b = sum(b*b for b in other_embedding) ** 0.5
            if norm_a*norm_b == 0:
                similarity = 0
            else:
                similarity = dot / (norm_a * norm_b)
        else:
            similarity = 0
        matches.append((similarity, u))
    matches.sort(reverse=True, key=lambda x: x[0])
    top_matches = []
    for sim, u in matches[:5]:
        if sim <= 0:
            continue
        prompt = f"Generate a short collaboration proposal for {user.username} and {u.username} based on their interests: {user.interests}; {u.interests}."
        proposal = client.completions.create(model="claude-2", prompt=prompt, max_tokens=100).completion if client else ""
        match_record = Match(user_id=user.id, match_id=u.id, proposal=proposal)
        db.add(match_record)
        db.commit()
        top_matches.append({"user": u.username, "proposal": proposal})
    return {"matches": top_matches}
