"""
Input validation and sanitization utilities for Tadjmeel Clinica API
"""
import re
from datetime import datetime
from typing import Any, Dict, List, Optional

class ValidationError(Exception):
    """Custom validation error"""
    pass

def sanitize_string(value: str, max_length: int = 200) -> str:
    """Remove dangerous characters and trim to max length"""
    if not isinstance(value, str):
        raise ValidationError("Value must be a string")

    # Strip whitespace
    value = value.strip()

    # Remove null bytes and control characters
    value = re.sub(r'[\x00-\x1f\x7f]', '', value)

    # Truncate to max length
    if len(value) > max_length:
        value = value[:max_length]

    return value

def validate_phone(phone: str) -> str:
    """Validate Algerian phone number format"""
    phone = sanitize_string(phone, 20)

    # Remove spaces, dashes, parentheses
    phone = re.sub(r'[\s\-\(\)]', '', phone)

    # Algerian phone: 0XXXXXXXXX or +213XXXXXXXXX
    if not re.match(r'^(\+213|0)[5-7]\d{8}$', phone):
        raise ValidationError("Format de téléphone invalide. Utilisez: 05XX XX XX XX ou +213 5XX XX XX XX")

    return phone

def validate_email(email: str) -> str:
    """Validate email format"""
    email = sanitize_string(email, 100).lower()

    if not re.match(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', email):
        raise ValidationError("Format d'email invalide")

    return email

def validate_date(date_str: str) -> str:
    """Validate date format YYYY-MM-DD"""
    date_str = sanitize_string(date_str, 10)

    try:
        datetime.strptime(date_str, '%Y-%m-%d')
        return date_str
    except ValueError:
        raise ValidationError("Format de date invalide. Utilisez: YYYY-MM-DD")

def validate_time_slot(time_slot: str) -> str:
    """Validate time slot format HH:MM"""
    time_slot = sanitize_string(time_slot, 5)

    if not re.match(r'^([01]\d|2[0-3]):([0-5]\d)$', time_slot):
        raise ValidationError("Format d'horaire invalide. Utilisez: HH:MM")

    return time_slot

def validate_status(status: str, allowed_statuses: List[str]) -> str:
    """Validate status is in allowed list"""
    status = sanitize_string(status, 50).lower()

    if status not in allowed_statuses:
        raise ValidationError(f"Statut invalide. Valeurs autorisées: {', '.join(allowed_statuses)}")

    return status

def validate_appointment_data(data: Dict[str, Any]) -> Dict[str, Any]:
    """Validate and sanitize appointment creation data"""
    validated = {}

    # Required fields
    if not data.get('patient_name'):
        raise ValidationError("Le nom du patient est obligatoire")
    validated['patient_name'] = sanitize_string(data['patient_name'], 100)

    if not data.get('phone'):
        raise ValidationError("Le numéro de téléphone est obligatoire")
    validated['phone'] = validate_phone(data['phone'])

    if not data.get('date'):
        raise ValidationError("La date est obligatoire")
    validated['date'] = validate_date(data['date'])

    if not data.get('time_slot'):
        raise ValidationError("L'horaire est obligatoire")
    validated['time_slot'] = validate_time_slot(data['time_slot'])

    if not data.get('specialty'):
        raise ValidationError("La spécialité est obligatoire")
    validated['specialty'] = sanitize_string(data['specialty'], 200)

    # Optional fields
    validated['city'] = sanitize_string(data.get('city', 'Alger'), 100)
    validated['doctor_name'] = sanitize_string(data.get('doctor_name', 'Premier créneau disponible'), 100)
    validated['treatment_name'] = sanitize_string(data.get('treatment_name', data.get('specialty', '')), 200)
    validated['treatment_zone'] = sanitize_string(data.get('treatment_zone', ''), 200)
    validated['notes'] = sanitize_string(data.get('notes', ''), 1000)
    validated['reference'] = sanitize_string(data.get('reference', f"TADJ-{datetime.now().strftime('%m%d%H%M')}"), 50)

    # Status validation
    status = data.get('status', 'pending')
    validated['status'] = validate_status(status, ['pending', 'confirmed', 'cancelled', 'completed'])

    return validated

def validate_patient_data(data: Dict[str, Any]) -> Dict[str, Any]:
    """Validate and sanitize patient registration data"""
    validated = {}

    # Required fields
    if not data.get('name'):
        raise ValidationError("Le nom du patient est obligatoire")
    validated['name'] = sanitize_string(data['name'], 100)

    if not data.get('phone'):
        raise ValidationError("Le numéro de téléphone est obligatoire")
    validated['phone'] = validate_phone(data['phone'])

    # Optional fields
    validated['city'] = sanitize_string(data.get('city', 'Alger'), 100)
    validated['assigned_doctor_name'] = sanitize_string(data.get('assigned_doctor_name', ''), 100)
    validated['specialty'] = sanitize_string(data.get('specialty', ''), 200)
    validated['phototype'] = sanitize_string(data.get('phototype', ''), 50)
    validated['medical_notes'] = sanitize_string(data.get('medical_notes', ''), 2000)

    return validated

def validate_objectid(oid: str) -> str:
    """Validate MongoDB ObjectId format"""
    oid = sanitize_string(oid, 24)

    if not re.match(r'^[a-f0-9]{24}$', oid):
        raise ValidationError("ID invalide")

    return oid
