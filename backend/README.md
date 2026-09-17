# Backend Flask & MongoDB — Tadjmeel Clinica Alger 🇩🇿

Ce dossier contient le serveur API REST complet développé en **Python Flask** connecté à **MongoDB** (`mongodb://localhost:27017/`).

## 📋 Prérequis
1. **Python 3.9+** installé sur votre machine
2. **MongoDB Community Server** installé et démarré en local sur `mongodb://localhost:27017/`

---

## 🚀 Installation & Démarrage Rapide

### 1. Démarrer MongoDB
Assurez-vous que le service MongoDB tourne sur votre ordinateur :
- **Sous Windows** : Démarrez le service `MongoDB` depuis *Services*, ou lancez :
  ```cmd
  mongod --dbpath "C:\data\db"
  ```
- **Sous Linux / macOS** :
  ```bash
  sudo systemctl start mongod
  # ou avec brew sur macOS :
  brew services start mongodb-community
  ```

Vérifiez que MongoDB écoute bien sur `mongodb://localhost:27017/`.

---

### 2. Installer les dépendances Python
Dans votre terminal, placez-vous dans le dossier `backend` :
```bash
cd backend
python -m venv venv

# Activation de l'environnement virtuel :
# Sur Windows :
venv\Scripts\activate
# Sur Linux / macOS :
source venv/bin/activate

# Installation :
pip install -r requirements.txt
```

---

### 3. Lancer le serveur Flask
```bash
python app.py
```
Le serveur démarre sur **`http://localhost:5000`**.

---

### 4. Initialiser la base de données (Seed automatique)
Lors du premier lancement, vous pouvez appeler l'endpoint de seed pour peupler les médecins, spécialités et patientes de test :
```bash
curl -X POST http://localhost:5000/api/seed
```
Ou cliquez sur le bouton **"Initialiser Données MongoDB"** directement depuis le panneau d'administration de l'application web !

---

## 📡 Liste des Endpoints REST Disponibles

### Rendez-vous (`/api/appointments`) :
- `GET /api/appointments` : Récupérer tous les RDVs (filtres : `?doctor=`, `?specialty=`, `?status=`, `?date=`)
- `POST /api/appointments` : Programmer un nouveau rendez-vous
- `PUT /api/appointments/<id>` : Reprogrammer un rendez-vous (Date, heure, médecin, notes)
- `PATCH /api/appointments/<id>/status` : Mettre à jour le statut (`confirmed`, `cancelled`, `completed`)
- `DELETE /api/appointments/<id>` : Supprimer un rendez-vous

### Patientes & Attribution (`/api/patients`) :
- `GET /api/patients` : Lister les patientes avec leur médecin attitré et spécialité
- `POST /api/patients` : Insérer une patiente avec son médecin traitant et sa spécialité

### Médecins & Spécialités :
- `GET /api/doctors` : Liste des médecins et praticiens
- `GET /api/specialties` : Liste des pôles et spécialités
- `GET /api/stats` : Statistiques de la journée (RDVs du jour, confirmés, annulés, etc.)
