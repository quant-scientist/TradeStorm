from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from typing import List, Optional
from pydantic import BaseModel
import os
from dotenv import load_dotenv
from datetime import timedelta
from auth import (
    create_access_token,
    create_refresh_token,
    get_current_user,
    verify_password,
    Token
)
from market import get_market_analysis

# Load environment variables
load_dotenv()

app = FastAPI(
    title="SpreadEdge API",
    description="Backend API for SpreadEdge Trading App",
    version="1.0.0"
)

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class User(BaseModel):
    email: str
    password: str
    full_name: Optional[str] = None

class TradingSignal(BaseModel):
    symbol: str
    signal_type: str
    price: float
    timestamp: str
    confidence: float

class Subscription(BaseModel):
    plan_id: str
    user_id: str
    status: str

# Routes
@app.get("/")
async def root():
    return {"message": "Welcome to SpreadEdge API"}

@app.post("/auth/register")
async def register_user(user: User):
    # TODO: Implement user registration with Supabase
    return {"message": "User registered successfully"}

@app.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    # Here you would typically verify the user's credentials against your database
    # For now, we'll use a dummy check
    if form_data.username != "test@example.com" or form_data.password != "password123":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=30)
    access_token = create_access_token(
        data={"sub": form_data.username}, expires_delta=access_token_expires
    )
    refresh_token = create_refresh_token(data={"sub": form_data.username})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "refresh_token": refresh_token
    }

@app.post("/refresh-token")
async def refresh_token(current_user: str = Depends(get_current_user)):
    access_token_expires = timedelta(minutes=30)
    access_token = create_access_token(
        data={"sub": current_user}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/users/me")
async def read_users_me(current_user: str = Depends(get_current_user)):
    return {"email": current_user}

@app.get("/signals", response_model=List[TradingSignal])
async def get_trading_signals():
    # TODO: Implement signal fetching logic
    return []

@app.post("/subscription/create")
async def create_subscription(subscription: Subscription):
    # TODO: Implement Stripe subscription creation
    return {"message": "Subscription created successfully"}

@app.get("/market/analysis")
async def get_market_analysis_endpoint():
    """Get comprehensive market analysis data."""
    return get_market_analysis()

@app.post("/copy-trade/execute")
async def execute_copy_trade():
    # TODO: Implement copy trading logic
    return {"message": "Copy trade executed successfully"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 