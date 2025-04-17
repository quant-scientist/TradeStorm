from datetime import datetime, timedelta
from typing import Optional
import base64
import hmac
import hashlib
import json
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel

# JWT Configuration
SECRET_KEY = "your_generated_secret_here"  # Replace with your actual secret
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
REFRESH_TOKEN_EXPIRE_DAYS = 7

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# OAuth2 scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

class Token(BaseModel):
    access_token: str
    token_type: str
    refresh_token: str

class TokenData(BaseModel):
    email: Optional[str] = None

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def create_token(data: dict, expires_delta: timedelta) -> str:
    # Create header
    header = {
        "alg": "HS256",
        "typ": "JWT"
    }
    header_encoded = base64.urlsafe_b64encode(json.dumps(header).encode()).decode().rstrip('=')

    # Create payload
    expire = datetime.utcnow() + expires_delta
    data.update({"exp": expire.timestamp()})
    payload_encoded = base64.urlsafe_b64encode(json.dumps(data).encode()).decode().rstrip('=')

    # Create signature
    signature = hmac.new(
        SECRET_KEY.encode(),
        f"{header_encoded}.{payload_encoded}".encode(),
        hashlib.sha256
    ).digest()
    signature_encoded = base64.urlsafe_b64encode(signature).decode().rstrip('=')

    return f"{header_encoded}.{payload_encoded}.{signature_encoded}"

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    if expires_delta is None:
        expires_delta = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    return create_token(data, expires_delta)

def create_refresh_token(data: dict) -> str:
    expires_delta = timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    return create_token(data, expires_delta)

def verify_token(token: str) -> dict:
    try:
        header_encoded, payload_encoded, signature_encoded = token.split('.')
        
        # Verify signature
        signature = base64.urlsafe_b64decode(signature_encoded + '=' * (-len(signature_encoded) % 4))
        expected_signature = hmac.new(
            SECRET_KEY.encode(),
            f"{header_encoded}.{payload_encoded}".encode(),
            hashlib.sha256
        ).digest()
        
        if not hmac.compare_digest(signature, expected_signature):
            raise ValueError("Invalid signature")
        
        # Decode payload
        payload = json.loads(base64.urlsafe_b64decode(payload_encoded + '=' * (-len(payload_encoded) % 4)))
        
        # Check expiration
        if datetime.fromtimestamp(payload['exp']) < datetime.utcnow():
            raise ValueError("Token expired")
        
        return payload
    except Exception:
        raise ValueError("Invalid token")

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = verify_token(token)
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = TokenData(email=email)
    except ValueError:
        raise credentials_exception
    
    return token_data.email 