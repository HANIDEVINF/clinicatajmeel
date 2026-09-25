# Tadjmeel Clinica - Production Configuration

## Environment Variables (.env)

Create a `.env` file in the `backend/` directory for production:

```env
# Flask Configuration
SECRET_KEY=GENERATE_RANDOM_SECRET_KEY_HERE_32_CHARS_MIN
JWT_EXPIRATION_HOURS=8
FLASK_ENV=production

# CORS - Add your production domain
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# MongoDB Configuration
MONGO_URI=mongodb://username:password@your-mongo-host:27017/
DB_NAME=tadjmeel_clinic

# Rate Limiting
RATELIMIT_STORAGE_URL=redis://localhost:6379/0
```

## Default Login Credentials (CHANGE IMMEDIATELY IN PRODUCTION!)

**Receptionist/Worker Portal:**
- Username: `receptionniste`
- Password: `tadj2026`

**Doctor Portals:**
- Dr. Inès: `dr.ines` / `ines2026`
- Dr. Karim: `dr.karim` / `karim2026`  
- Sarah M.: `sarah` / `sarah2026`

**Admin:**
- Username: `admin`
- Password: `admin2026`

## Security Checklist

- [ ] Change all default passwords immediately
- [ ] Generate strong SECRET_KEY (use `python -c "import secrets; print(secrets.token_hex(32))"`)
- [ ] Enable MongoDB authentication
- [ ] Configure HTTPS/TLS certificates
- [ ] Set up proper firewall rules (only allow ports 443, 5000)
- [ ] Enable MongoDB authentication and create database users
- [ ] Configure proper CORS origins (no wildcards)
- [ ] Set up backup strategy for MongoDB
- [ ] Configure rate limiting with Redis (recommended for production)
- [ ] Enable Flask production mode (set FLASK_ENV=production)
- [ ] Set up logging and monitoring
- [ ] Implement session timeout
- [ ] Add CSRF protection if serving HTML forms

## Deployment Steps

1. **Prepare Server:**
   ```bash
   # Install dependencies
   apt update && apt install python3 python3-pip mongodb nginx
   
   # Install Node.js for React build
   curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
   apt install -y nodejs
   ```

2. **Backend Setup:**
   ```bash
   cd backend/
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   
   # Create .env file with production credentials
   nano .env
   ```

3. **Frontend Build:**
   ```bash
   cd ../
   npm install
   npm run build
   # Dist files will be in dist/ folder
   ```

4. **Configure Nginx:**
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;
       
       # Redirect to HTTPS
       return 301 https://$server_name$request_uri;
   }
   
   server {
       listen 443 ssl http2;
       server_name yourdomain.com;
       
       ssl_certificate /path/to/cert.pem;
       ssl_certificate_key /path/to/key.pem;
       
       # Serve React frontend
       location / {
           root /var/www/tadjmeel/dist;
           try_files $uri $uri/ /index.html;
       }
       
       # Proxy Flask API
       location /api/ {
           proxy_pass http://127.0.0.1:5000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```

5. **Run Flask with Gunicorn (Production WSGI Server):**
   ```bash
   pip install gunicorn
   gunicorn -w 4 -b 127.0.0.1:5000 app:app
   ```

6. **Set up systemd service:**
   ```ini
   [Unit]
   Description=Tadjmeel Clinica Flask API
   After=network.target mongodb.service
   
   [Service]
   User=www-data
   WorkingDirectory=/var/www/tadjmeel/backend
   Environment="PATH=/var/www/tadjmeel/backend/venv/bin"
   ExecStart=/var/www/tadjmeel/backend/venv/bin/gunicorn -w 4 -b 127.0.0.1:5000 app:app
   Restart=always
   
   [Install]
   WantedBy=multi-user.target
   ```

## Monitoring

- Monitor Flask logs: `journalctl -u tadjmeel-api -f`
- Monitor MongoDB: `mongosh --eval "db.serverStatus()"`
- Monitor Nginx: `tail -f /var/log/nginx/access.log`

## Backup Strategy

```bash
# Daily MongoDB backup
mongodump --db tadjmeel_clinic --out /backups/$(date +%Y%m%d)

# Keep last 7 days only
find /backups -type d -mtime +7 -exec rm -rf {} \;
```
