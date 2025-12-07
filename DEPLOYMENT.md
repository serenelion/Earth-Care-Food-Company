# Earth Care Food Company - Deployment Guide

## 🚀 Production Deployment Checklist

### Pre-Deployment

#### 1. Environment Variables (Backend)
Create `backend/.env` for production:
```bash
DEBUG=False
SECRET_KEY=<generate-with-django-secret-key-generator>
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com

# PostgreSQL Production Database
DB_ENGINE=django.db.backends.postgresql
DB_NAME=earthcare_prod
DB_USER=earthcare_user
DB_PASSWORD=<strong-password>
DB_HOST=localhost
DB_PORT=5432

# Stripe Production Keys
STRIPE_SECRET_KEY=sk_live_your_live_key
STRIPE_PUBLISHABLE_KEY=pk_live_your_live_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# SendGrid
SENDGRID_API_KEY=<production-key>
FROM_EMAIL=hello@earthcare.food
ADMIN_EMAIL=admin@earthcare.food

# Gemini API
GEMINI_API_KEY=<production-key>

# CORS
FRONTEND_URL=https://yourdomain.com
```

#### 2. Environment Variables (Frontend)
Create `frontend/.env.production`:
```bash
VITE_API_BASE_URL=https://api.yourdomain.com
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_live_key
```

### Backend Deployment (Django)

#### Option A: Traditional VPS (DigitalOcean, Linode, AWS EC2)

**1. Install System Dependencies**
```bash
sudo apt update
sudo apt install python3.10 python3.10-venv postgresql nginx
```

**2. Setup PostgreSQL**
```bash
sudo -u postgres psql
CREATE DATABASE earthcare_prod;
CREATE USER earthcare_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE earthcare_prod TO earthcare_user;
\q
```

**3. Deploy Application**
```bash
cd /var/www/earth-care-food-company/backend
python3.10 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
pip install gunicorn
python manage.py migrate
python manage.py collectstatic --noinput
python manage.py seed_products
python manage.py createsuperuser
```

**4. Gunicorn Service**
Create `/etc/systemd/system/earthcare.service`:
```ini
[Unit]
Description=Earth Care Food Company Django
After=network.target

[Service]
User=www-data
Group=www-data
WorkingDirectory=/var/www/earth-care-food-company/backend
Environment="PATH=/var/www/earth-care-food-company/backend/venv/bin"
ExecStart=/var/www/earth-care-food-company/backend/venv/bin/gunicorn \
    --workers 3 \
    --bind unix:/var/www/earth-care-food-company/backend/earthcare.sock \
    earthcare.wsgi:application

[Install]
WantedBy=multi-user.target
```

Start service:
```bash
sudo systemctl start earthcare
sudo systemctl enable earthcare
```

**5. Nginx Configuration**
Create `/etc/nginx/sites-available/earthcare`:
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location /static/ {
        alias /var/www/earth-care-food-company/backend/staticfiles/;
    }

    location /media/ {
        alias /var/www/earth-care-food-company/backend/media/;
    }

    location / {
        proxy_pass http://unix:/var/www/earth-care-food-company/backend/earthcare.sock;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/earthcare /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

**6. SSL with Let's Encrypt**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d api.yourdomain.com
```

#### Option B: Platform as a Service (Heroku, Railway, Render)

**Heroku Example:**

1. Create `Procfile` in `backend/`:
```
web: gunicorn earthcare.wsgi --log-file -
release: python manage.py migrate
```

2. Create `runtime.txt`:
```
python-3.10.12
```

3. Deploy:
```bash
heroku create earthcare-api
heroku addons:create heroku-postgresql:mini
heroku config:set SECRET_KEY=your_secret_key
heroku config:set DEBUG=False
# ... set all other env vars
git subtree push --prefix backend heroku main
```

### Frontend Deployment

#### Option A: Vercel (Recommended for Vite)

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy from frontend directory:
```bash
cd frontend
vercel --prod
```

3. Set environment variables in Vercel dashboard:
   - `VITE_API_BASE_URL`
   - `VITE_STRIPE_PUBLISHABLE_KEY`

#### Option B: Netlify

1. Build frontend:
```bash
cd frontend
npm run build
```

2. Deploy `dist/` folder to Netlify
3. Set environment variables in Netlify dashboard

#### Option C: Same VPS as Backend

1. Build frontend:
```bash
cd frontend
npm run build
```

2. Serve with Nginx:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    root /var/www/earth-care-food-company/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### Stripe Configuration

1. **Add Webhook Endpoint** in Stripe Dashboard:
   - URL: `https://api.yourdomain.com/api/store/stripe/webhook/`
   - Events: `payment_intent.succeeded`, `payment_intent.payment_failed`
   - Copy webhook secret to `.env`

2. **Update Product Prices** in Stripe:
   - Create products in Stripe dashboard
   - Copy price IDs to database

### Post-Deployment

1. **Test Payment Flow:**
   - Use test cards in test mode
   - Switch to live mode when ready

2. **Setup Monitoring:**
   - Django: Sentry for error tracking
   - Uptime: UptimeRobot or Pingdom
   - Logs: CloudWatch, Papertrail, or Logtail

3. **Backup Database:**
```bash
pg_dump earthcare_prod > backup.sql
```

4. **Setup Email Deliverability:**
   - Verify SendGrid sender domain
   - Setup SPF, DKIM, DMARC records

## 🔒 Security Hardening

1. **Django Settings:**
   - Set `SECURE_SSL_REDIRECT = True`
   - Set `SESSION_COOKIE_SECURE = True`
   - Set `CSRF_COOKIE_SECURE = True`
   - Add `SECURE_HSTS_SECONDS = 31536000`

2. **Firewall:**
```bash
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

3. **Rate Limiting:**
   - Install `django-ratelimit`
   - Apply to checkout and API endpoints

## 📊 Performance Optimization

1. **Database:**
   - Add indexes to frequently queried fields
   - Use connection pooling (pgBouncer)

2. **Static Files:**
   - Use CDN (Cloudflare, AWS CloudFront)
   - Enable gzip compression

3. **Caching:**
   - Redis for session storage
   - Cache product catalog

## 💰 Cost Estimation (Monthly)

### Minimal Setup (~$25-40/month)
- **VPS**: DigitalOcean Droplet ($12)
- **Database**: Included in VPS
- **Stripe**: Free (2.9% + $0.30 per transaction)
- **SendGrid**: Free tier (100 emails/day)
- **Gemini API**: Pay-per-use (~$5-10)

### Recommended Setup (~$80-120/month)
- **Backend**: Railway/Render ($10-20)
- **Database**: Managed PostgreSQL ($15-25)
- **Frontend**: Vercel ($0-20)
- **CDN**: Cloudflare ($0-20)
- **Email**: SendGrid Essentials ($20)
- **Monitoring**: Sentry ($0-26)
- **Gemini API**: ~$10-20

## 🚨 Troubleshooting

### Common Issues

**Static Files Not Loading:**
```bash
python manage.py collectstatic --noinput
sudo systemctl restart earthcare
```

**Database Connection Errors:**
- Check PostgreSQL is running: `sudo systemctl status postgresql`
- Verify credentials in `.env`
- Check firewall rules

**CORS Errors:**
- Verify `FRONTEND_URL` in backend `.env`
- Check `CORS_ALLOWED_ORIGINS` in settings.py

**Stripe Webhook Failing:**
- Verify webhook secret matches Stripe dashboard
- Check endpoint is publicly accessible
- Review Stripe webhook logs

## 📞 Support Resources

- **Django Deployment**: https://docs.djangoproject.com/en/4.2/howto/deployment/
- **Vite Production**: https://vitejs.dev/guide/build.html
- **Stripe Webhooks**: https://stripe.com/docs/webhooks
- **SendGrid Setup**: https://docs.sendgrid.com/

---

**Ready to launch! 🚀**
