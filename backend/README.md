# Backend Flask & MongoDB — Tadjmeel Clinica Alger 🇩🇿

Ce dossier contient le serveur API REST complet développé en **Python Flask** connecté à **MongoDB** (`mongodb://localhost:27017/`).

## 📋 Prérequis Rapides (Windows 10/11)

### 1. Démarrer MongoDB
Assurez-vous que le service MongoDB tourne sur votre ordinateur :
- **Installation en 1 commande (CMD en mode Administrateur)** :
  ```cmd
  winget install MongoDB.Server --accept-package-agreements --accept-source-agreements
  ```
- **Démarrage du service (CMD en mode Administrateur)** :
  ```cmd
  net start MongoDB
  ```

MongoDB écoute par défaut sur `mongodb://localhost:27017/`.

---

## 🚀 Démarrage du Backend Flask (Port 5000)

Dans votre terminal :
```cmd
cd C:\Users\HANI\Desktop\freelance\tajmeelclinic\backend
venv\Scripts\activate
python app.py
```
Le serveur démarre sur **`http://localhost:5000`**.

---

## 💻 Démarrage du Frontend React (Port 3000)

Dans un second terminal :
```cmd
cd C:\Users\HANI\Desktop\freelance\tajmeelclinic
npm install --legacy-peer-deps
npm run dev
```
Le site web s'ouvre sur **`http://localhost:3000`**.

---

## 🌿 Initialiser la base de données (Seed automatique)
Lors du premier lancement, vous pouvez appeler l'endpoint de seed pour peupler les médecins, spécialités et patientes de test :
- Directement en cliquant sur le bouton **« Initialiser Données »** dans l'interface Secrétariat du site web, ou via terminal :
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
