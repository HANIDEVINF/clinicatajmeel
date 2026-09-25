"""
Authentication and authorization utilities for Tadjmeel Clinica
"""
import os
import jwt
import hashlib
from datetime import datetime, timedelta
from functools import wraps
from flask import request, jsonify

SECRET_KEY = os.getenv("SECRET_KEY", "CHANGE_THIS_IN_PRODUCTION_tajmeelclinica2026")
JWT_EXPIRATION_HOURS = int(os.getenv("JWT_EXPIRATION_HOURS", "8"))

def hash_password(password: str) -> str:
    """Hash password using SHA-256"""
    return hashlib.sha256(password.encode()).hexdigest()

def verify_password(password: str, hashed: str) -> bool:
    """Verify password against hash"""
    return hash_password(password) == hashed

def generate_token(user_id: str, username: str, role: str) -> str:
    """Generate JWT token for authenticated user"""
    payload = {
        'user_id': user_id,
        'username': username,
        'role': role,
        'exp': datetime.utcnow() + timedelta(hours=JWT_EXPIRATION_HOURS),
        'iat': datetime.utcnow()
    }
    return jwt.encode(payload, SECRET_KEY, algorithm='HS256')

def decode_token(token: str) -> dict:
    """Decode and verify JWT token"""
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
    except jwt.ExpiredSignatureError:
        raise Exception("Token expiré. Veuillez vous reconnecter.")
    except jwt.InvalidTokenError:
        raise Exception("Token invalide.")

def token_required(f):
    """Decorator to protect routes requiring authentication"""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None

        # Check Authorization header
        auth_header = request.headers.get('Authorization')
        if auth_header and auth_header.startswith('Bearer '):
            token = auth_header.split(' ')[1]

        if not token:
            return jsonify({'error': 'Token manquant. Authentification requise.'}), 401

        try:
            payload = decode_token(token)
            request.current_user = payload
        except Exception as e:
            return jsonify({'error': str(e)}), 401

        return f(*args, **kwargs)

    return decorated

def role_required(allowed_roles: list):
    """Decorator to restrict access by role"""
    def decorator(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            if not hasattr(request, 'current_user'):
                return jsonify({'error': 'Authentification requise'}), 401

            user_role = request.current_user.get('role')
            if user_role not in allowed_roles:
                return jsonify({'error': 'Accès refusé. Permissions insuffisantes.'}), 403

            return f(*args, **kwargs)
        return decorated
    return decorator

# Default users for initial setup
DEFAULT_USERS = [
    {
        "username": "receptionniste",
        "password": hash_password("tadj2026"),
        "role": "worker",
        "full_name": "Réceptionniste Clinique",
        "active": True
    },
    {
        "username": "dr.ines",
        "password": hash_password("ines2026"),
        "role": "doctor",
        "full_name": "Dr. Inès B.",
        "active": True
    },
    {
        "username": "dr.karim",
        "password": hash_password("karim2026"),
        "role": "doctor",
        "full_name": "Dr. Karim A.",
        "active": True
    },
    {
        "username": "sarah",
        "password": hash_password("sarah2026"),
        "role": "doctor",
        "full_name": "Sarah M.",
        "active": True
    },
    {
        "username": "admin",
        "password": hash_password("admin2026"),
        "role": "admin",
        "full_name": "Administrateur",
        "active": True
    }
]
