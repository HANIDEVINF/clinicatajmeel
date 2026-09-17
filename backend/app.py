import os
from datetime import datetime
from bson import ObjectId
from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient

app = Flask(__name__)
# Enable CORS for Vite dev server and local clients
CORS(app, resources={r"/api/*": {"origins": "*"}})

# MongoDB connection configuration
# Defaults to local MongoDB instance on port 27017
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
DB_NAME = os.getenv("DB_NAME", "tadjmeel_clinic")

try:
    client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=2500)
    db = client[DB_NAME]
    appointments_col = db["appointments"]
    patients_col = db["patients"]
    doctors_col = db["doctors"]
    specialties_col = db["specialties"]
    # Check connection
    client.server_info()
    mongo_connected = True
    print(f"✅ Connecté avec succès à MongoDB: {MONGO_URI} (Base: {DB_NAME})")
except Exception as e:
    mongo_connected = False
    print(f"⚠️ Avertissement: Impossible de joindre MongoDB à {MONGO_URI}. ({e})")
    print("Assurez-vous que MongoDB tourne avec 'mongod' ou installez MongoDB Community Server.")

# Helper to serialize MongoDB documents to JSON
def serialize_doc(doc):
    if not doc:
        return None
    doc["id"] = str(doc["_id"])
    del doc["_id"]
    return doc

def serialize_list(cursor):
    return [serialize_doc(doc) for doc in cursor]

# Initial Seed Data for Tadjmeel Clinica
INITIAL_DOCTORS = [
    {
        "_id": ObjectId("66e850010000000000000001"),
        "id_code": "DOC-INES",
        "name": "Dr. Inès B.",
        "role": "Médecin Coordinatrice & Esthétique Médicale",
        "specialty": "Médecine Morphologique, Injectables & Anti-Âge",
        "specialty_id": "injectables",
        "phone": "0558 45 56 82",
        "email": "dr.ines@tadjmeel-clinica.dz",
        "experience": "12 ans d'expérience",
        "languages": ["Français", "Arabe", "Anglais"],
        "active": True
    },
    {
        "_id": ObjectId("66e850010000000000000002"),
        "id_code": "DOC-KARIM",
        "name": "Dr. Karim A.",
        "role": "Dermatologue Spécialiste",
        "specialty": "Dermatologie Clinique, Lésions & Protocoles Laser",
        "specialty_id": "dermatologie",
        "phone": "0552 90 79 56",
        "email": "dr.karim@tadjmeel-clinica.dz",
        "experience": "15 ans d'expérience",
        "languages": ["Français", "Arabe"],
        "active": True
    },
    {
        "_id": ObjectId("66e850010000000000000003"),
        "id_code": "DOC-SARAH",
        "name": "Sarah M.",
        "role": "Praticienne Laseriste & Dermo-Thérapeute",
        "specialty": "Épilation Laser Haute Puissance & Soins HydraFacial",
        "specialty_id": "laser",
        "phone": "0552 90 79 56",
        "email": "sarah.m@tadjmeel-clinica.dz",
        "experience": "8 ans d'expérience",
        "languages": ["Français", "Arabe"],
        "active": True
    }
]

INITIAL_SPECIALTIES = [
    {"id": "laser", "name": "Épilation Laser SPLENDOR X™", "department": "Pôle Laser"},
    {"id": "visage", "name": "Soins Médicaux Visage & HydraFacial", "department": "Pôle Soins Visage"},
    {"id": "injectables", "name": "Injections & Médecine Anti-Âge", "department": "Pôle Esthétique Médicale"},
    {"id": "lifu", "name": "Lifting Ultrasons LifU LinearZ™", "department": "Pôle Haute Technologie"},
    {"id": "cheveux", "name": "Trichologie, Mésothérapie & PRP Capillaire", "department": "Pôle Capillaire"}
]

INITIAL_PATIENTS = [
    {
        "_id": ObjectId("66e850020000000000000001"),
        "name": "Amina Mansouri",
        "phone": "0550 12 34 56",
        "city": "Birkhadem, Alger",
        "assigned_doctor_name": "Sarah M.",
        "specialty": "Épilation Laser SPLENDOR X™",
        "phototype": "Phototype III",
        "medical_notes": "Traitement laser aisselles et jambes complètes. Tolérance optimale avec BLEND X.",
        "registered_at": "2026-09-01T10:00:00Z"
    },
    {
        "_id": ObjectId("66e850020000000000000002"),
        "name": "Yasmine Bouzid",
        "phone": "0661 78 90 12",
        "city": "Hydra, Alger",
        "assigned_doctor_name": "Dr. Inès B.",
        "specialty": "Injections & Médecine Anti-Âge",
        "phototype": "Phototype II",
        "medical_notes": "Comblement sillons nasogéniens par acide hyaluronique réticulé (1ml).",
        "registered_at": "2026-09-05T14:30:00Z"
    },
    {
        "_id": ObjectId("66e850020000000000000003"),
        "name": "Selma Haddad",
        "phone": "0770 45 67 89",
        "city": "Kouba, Alger",
        "assigned_doctor_name": "Dr. Karim A.",
        "specialty": "Soins Médicaux Visage & HydraFacial",
        "phototype": "Phototype IV",
        "medical_notes": "Soin mensuel HydraFacial MD Elite avec protocole booster antioxydant.",
        "registered_at": "2026-09-10T11:00:00Z"
    }
]

# Root route informing about API endpoints and Frontend URL
@app.route("/", methods=["GET"])
def index():
    if "text/html" in request.headers.get("Accept", ""):
        status_badge = '<span style="color:#10b981;font-weight:bold;">Connecté ✅</span>' if mongo_connected else '<span style="color:#ef4444;font-weight:bold;">En attente de démarrage (Port 27017) ⚠️</span>'
        return f"""
        <!DOCTYPE html>
        <html lang="fr">
        <head>
            <meta charset="UTF-8">
            <title>API Backend Flask — Tadjmeel Clinica</title>
            <style>
                body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #1c1a17; color: #f5efe6; padding: 40px 20px; line-height: 1.6; margin: 0; }}
                .card {{ max-width: 650px; margin: 0 auto; background: #26231e; border: 1px solid #c49b4b; border-radius: 16px; padding: 32px; box-shadow: 0 20px 40px rgba(0,0,0,0.5); }}
                h1 {{ font-family: 'Georgia', serif; color: #e2c17d; margin-top: 0; font-size: 24px; }}
                .btn {{ display: inline-block; background: #c49b4b; color: #1c1a17; font-weight: bold; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-top: 16px; }}
                .btn:hover {{ background: #dfba6d; }}
                code {{ background: #151412; padding: 3px 8px; border-radius: 4px; color: #f5dfb3; font-size: 13px; }}
                ul {{ padding-left: 20px; }}
                li {{ margin-bottom: 8px; }}
            </style>
        </head>
        <body>
            <div class="card">
                <h1>Tadjmeel Clinica — API Backend Flask</h1>
                <p>Le serveur backend Python est <strong>actif et fonctionnel</strong> sur le port 5000.</p>
                <p><strong>Statut MongoDB :</strong> {status_badge}</p>
                
                <div style="margin: 24px 0; padding: 16px; background: #1b1916; border-radius: 8px; border-left: 4px solid #c49b4b;">
                    <h3 style="margin: 0 0 8px 0; color: #e2c17d;">Pour ouvrir le site internet :</h3>
                    <p style="margin: 0 0 12px 0; font-size: 14px;">Le site web React de la clinique tourne sur le port 3000 via <code>npm run dev</code>.</p>
                    <a href="http://localhost:3000" class="btn" target="_blank">Ouvrir le Site Web (http://localhost:3000) &rarr;</a>
                </div>

                <h3>Points de terminaison API (REST) :</h3>
                <ul style="font-size: 13px;">
                    <li><a href="/api/health" style="color:#e2c17d;">/api/health</a> : Vérification de l'état système & MongoDB</li>
                    <li><a href="/api/appointments" style="color:#e2c17d;">/api/appointments</a> : Liste des rendez-vous</li>
                    <li><a href="/api/patients" style="color:#e2c17d;">/api/patients</a> : Fiches des patientes</li>
                    <li><a href="/api/doctors" style="color:#e2c17d;">/api/doctors</a> : Équipe médicale</li>
                </ul>
            </div>
        </body>
        </html>
        """

    return jsonify({
        "message": "Bienvenue sur l'API Backend Flask de Tadjmeel Clinica",
        "frontend_url": "http://localhost:3000",
        "instructions": "Le site web s'exécute sur le port 3000 avec la commande 'npm run dev'.",
        "mongo_connected": mongo_connected,
        "endpoints": {
            "health": "/api/health",
            "stats": "/api/stats",
            "appointments": "/api/appointments",
            "patients": "/api/patients",
            "doctors": "/api/doctors",
            "specialties": "/api/specialties",
            "seed": "POST /api/seed"
        }
    })

# Health check & system status
@app.route("/api/health", methods=["GET"])
def health_check():
    return jsonify({
        "status": "ok",
        "clinic": "Tadjmeel Clinica Alger",
        "mongo_connected": mongo_connected,
        "mongo_uri": MONGO_URI,
        "database": DB_NAME,
        "timestamp": datetime.utcnow().isoformat()
    })

# Seed Database Endpoint
@app.route("/api/seed", methods=["POST"])
def seed_database():
    if not mongo_connected:
        return jsonify({"error": "MongoDB is not connected"}), 503

    # Seed doctors if empty
    if doctors_col.count_documents({}) == 0:
        doctors_col.insert_many(INITIAL_DOCTORS)
    
    # Seed specialties if empty
    if specialties_col.count_documents({}) == 0:
        specialties_col.insert_many(INITIAL_SPECIALTIES)

    # Seed patients if empty
    if patients_col.count_documents({}) == 0:
        patients_col.insert_many(INITIAL_PATIENTS)

    return jsonify({
        "success": True,
        "message": "Base de données Tadjmeel Clinica initialisée avec succès !",
        "counts": {
            "doctors": doctors_col.count_documents({}),
            "specialties": specialties_col.count_documents({}),
            "patients": patients_col.count_documents({}),
            "appointments": appointments_col.count_documents({})
        }
    })

# =========================================================================
# APPOINTMENTS APIs (Gérer les RDVs : Lister, Programmer, Reprogrammer, Annuler)
# =========================================================================

@app.route("/api/appointments", methods=["GET"])
def get_appointments():
    if not mongo_connected:
        return jsonify({"error": "MongoDB is not available"}), 503

    query = {}
    doctor = request.args.get("doctor")
    status = request.args.get("status")
    specialty = request.args.get("specialty")
    date = request.args.get("date")

    if doctor and doctor != "all":
        query["doctor_name"] = doctor
    if status and status != "all":
        query["status"] = status
    if specialty and specialty != "all":
        query["specialty"] = specialty
    if date:
        query["date"] = date

    appointments = list(appointments_col.find(query).sort("created_at", -1))
    return jsonify({"success": True, "appointments": serialize_list(appointments)})

@app.route("/api/appointments", methods=["POST"])
def create_appointment():
    """Programmer un nouveau rendez-vous"""
    if not mongo_connected:
        return jsonify({"error": "MongoDB is not available"}), 503

    data = request.get_json() or {}
    
    required_fields = ["patient_name", "phone", "date", "time_slot", "specialty"]
    for field in required_fields:
        if not data.get(field):
            return jsonify({"error": f"Le champ '{field}' est obligatoire"}), 400

    new_appointment = {
        "reference": data.get("reference") or f"TADJ-{datetime.now().strftime('%m%d%H%M')}",
        "patient_name": data.get("patient_name").strip(),
        "phone": data.get("phone").strip(),
        "city": data.get("city", "Alger"),
        "doctor_name": data.get("doctor_name", "Premier créneau disponible"),
        "specialty": data.get("specialty"),
        "treatment_name": data.get("treatment_name", data.get("specialty")),
        "treatment_zone": data.get("treatment_zone", ""),
        "date": data.get("date"),
        "time_slot": data.get("time_slot"),
        "notes": data.get("notes", ""),
        "status": data.get("status", "pending"), # 'pending', 'confirmed', 'cancelled', 'completed'
        "cancellation_reason": "",
        "created_at": datetime.utcnow().isoformat(),
        "updated_at": datetime.utcnow().isoformat()
    }

    result = appointments_col.insert_one(new_appointment)
    new_appointment["id"] = str(result.inserted_id)
    del new_appointment["_id"]

    # Also automatically ensure patient exists in patients collection
    existing_patient = patients_col.find_one({"phone": new_appointment["phone"]})
    if not existing_patient:
        patients_col.insert_one({
            "name": new_appointment["patient_name"],
            "phone": new_appointment["phone"],
            "city": new_appointment["city"],
            "assigned_doctor_name": new_appointment["doctor_name"],
            "specialty": new_appointment["specialty"],
            "phototype": "Non renseigné",
            "medical_notes": new_appointment.get("notes", ""),
            "registered_at": datetime.utcnow().isoformat()
        })

    return jsonify({
        "success": True,
        "message": "Rendez-vous programmé avec succès !",
        "appointment": new_appointment
    }), 201

@app.route("/api/appointments/<appointment_id>", methods=["PUT"])
def reschedule_appointment(appointment_id):
    """Reprogrammer un rendez-vous (Date, heure, médecin, notes)"""
    if not mongo_connected:
        return jsonify({"error": "MongoDB is not available"}), 503

    try:
        obj_id = ObjectId(appointment_id)
    except Exception:
        return jsonify({"error": "Format d'identifiant invalide"}), 400

    data = request.get_json() or {}
    update_data = {
        "updated_at": datetime.utcnow().isoformat()
    }

    for key in ["date", "time_slot", "doctor_name", "specialty", "treatment_name", "treatment_zone", "notes"]:
        if key in data:
            update_data[key] = data[key]

    if "status" in data:
        update_data["status"] = data["status"]

    result = appointments_col.find_one_and_update(
        {"_id": obj_id},
        {"$set": update_data},
        return_document=True
    )

    if not result:
        return jsonify({"error": "Rendez-vous introuvable"}), 404

    return jsonify({
        "success": True,
        "message": "Rendez-vous reprogrammé avec succès !",
        "appointment": serialize_doc(result)
    })

@app.route("/api/appointments/<appointment_id>/status", methods=["PATCH"])
def update_appointment_status(appointment_id):
    """Changer le statut : Confirmer, Annuler ou Terminer"""
    if not mongo_connected:
        return jsonify({"error": "MongoDB is not available"}), 503

    try:
        obj_id = ObjectId(appointment_id)
    except Exception:
        return jsonify({"error": "Format d'identifiant invalide"}), 400

    data = request.get_json() or {}
    new_status = data.get("status")
    reason = data.get("reason", "")

    if new_status not in ["pending", "confirmed", "cancelled", "completed"]:
        return jsonify({"error": "Statut non valide"}), 400

    update_fields = {
        "status": new_status,
        "updated_at": datetime.utcnow().isoformat()
    }
    if reason:
        update_fields["cancellation_reason"] = reason

    result = appointments_col.find_one_and_update(
        {"_id": obj_id},
        {"$set": update_fields},
        return_document=True
    )

    if not result:
        return jsonify({"error": "Rendez-vous introuvable"}), 404

    return jsonify({
        "success": True,
        "message": f"Statut mis à jour : {new_status}",
        "appointment": serialize_doc(result)
    })

@app.route("/api/appointments/<appointment_id>", methods=["DELETE"])
def delete_appointment(appointment_id):
    """Supprimer définitivement un rendez-vous"""
    if not mongo_connected:
        return jsonify({"error": "MongoDB is not available"}), 503

    try:
        obj_id = ObjectId(appointment_id)
    except Exception:
        return jsonify({"error": "Format d'identifiant invalide"}), 400

    result = appointments_col.delete_one({"_id": obj_id})
    if result.deleted_count == 0:
        return jsonify({"error": "Rendez-vous introuvable"}), 404

    return jsonify({"success": True, "message": "Rendez-vous supprimé avec succès"})

# =========================================================================
# PATIENTS APIs (Insérer chaque patient pour son médecin et sa spécialité)
# =========================================================================

@app.route("/api/patients", methods=["GET"])
def get_patients():
    if not mongo_connected:
        return jsonify({"error": "MongoDB is not available"}), 503

    doctor = request.args.get("doctor")
    specialty = request.args.get("specialty")
    search = request.args.get("search")

    query = {}
    if doctor and doctor != "all":
        query["assigned_doctor_name"] = doctor
    if specialty and specialty != "all":
        query["specialty"] = specialty
    if search:
        query["$or"] = [
            {"name": {"$regex": search, "$options": "i"}},
            {"phone": {"$regex": search, "$options": "i"}},
            {"city": {"$regex": search, "$options": "i"}}
        ]

    patients = list(patients_col.find(query).sort("registered_at", -1))
    return jsonify({"success": True, "patients": serialize_list(patients)})

@app.route("/api/patients", methods=["POST"])
def create_patient():
    """Insérer un nouveau patient et l'assigner à son médecin et sa spécialité"""
    if not mongo_connected:
        return jsonify({"error": "MongoDB is not available"}), 503

    data = request.get_json() or {}
    if not data.get("name") or not data.get("phone"):
        return jsonify({"error": "Nom et numéro de téléphone obligatoires"}), 400

    new_patient = {
        "name": data.get("name").strip(),
        "phone": data.get("phone").strip(),
        "city": data.get("city", "Alger").strip(),
        "assigned_doctor_name": data.get("assigned_doctor_name", "Dr. Inès B."),
        "specialty": data.get("specialty", "Épilation Laser SPLENDOR X™"),
        "phototype": data.get("phototype", "Phototype III"),
        "medical_notes": data.get("medical_notes", ""),
        "registered_at": datetime.utcnow().isoformat()
    }

    result = patients_col.insert_one(new_patient)
    new_patient["id"] = str(result.inserted_id)
    del new_patient["_id"]

    return jsonify({
        "success": True,
        "message": f"Patiente {new_patient['name']} enregistrée avec succès !",
        "patient": new_patient
    }), 201

# =========================================================================
# DOCTORS & SPECIALTIES APIs
# =========================================================================

@app.route("/api/doctors", methods=["GET"])
def get_doctors():
    if not mongo_connected:
        # Fallback to in-memory initial doctors
        return jsonify({"success": True, "doctors": [serialize_doc(d.copy()) for d in INITIAL_DOCTORS]})

    doctors = list(doctors_col.find({"active": True}))
    if not doctors:
        doctors = INITIAL_DOCTORS
    return jsonify({"success": True, "doctors": serialize_list(doctors)})

@app.route("/api/specialties", methods=["GET"])
def get_specialties():
    if not mongo_connected:
        return jsonify({"success": True, "specialties": INITIAL_SPECIALTIES})

    specialties = list(specialties_col.find())
    if not specialties:
        specialties = INITIAL_SPECIALTIES
    return jsonify({"success": True, "specialties": serialize_list(specialties)})

# =========================================================================
# STATS API (Pour tableau de bord secrétaire et praticiens)
# =========================================================================

@app.route("/api/stats", methods=["GET"])
def get_stats():
    today = datetime.now().strftime("%Y-%m-%d")
    
    if not mongo_connected:
        return jsonify({
            "success": True,
            "stats": {
                "today_appointments": 8,
                "pending_requests": 3,
                "confirmed": 14,
                "cancelled": 2,
                "total_patients": 42
            }
        })

    today_count = appointments_col.count_documents({"date": today})
    pending_count = appointments_col.count_documents({"status": "pending"})
    confirmed_count = appointments_col.count_documents({"status": "confirmed"})
    cancelled_count = appointments_col.count_documents({"status": "cancelled"})
    total_patients = patients_col.count_documents({})

    return jsonify({
        "success": True,
        "stats": {
            "today_appointments": today_count,
            "pending_requests": pending_count,
            "confirmed": confirmed_count,
            "cancelled": cancelled_count,
            "total_patients": total_patients
        }
    })

if __name__ == "__main__":
    print("🚀 Démarrage du serveur Flask Tadjmeel Clinica sur http://localhost:5000")
    app.run(host="0.0.0.0", port=5000, debug=True)
