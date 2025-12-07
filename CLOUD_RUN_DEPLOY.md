# Google Cloud Run Deployment Guide

## Prerequisites

1. **Google Cloud Project**
   - Project ID: `gen-lang-client-0308665609`
   - Project Number: `649962693042`
   - Region: `us-west1`

2. **Domain**
   - Domain: `earthcare.food`

3. **Required APIs** (Enable these in Google Cloud Console)
   ```bash
   gcloud services enable run.googleapis.com
   gcloud services enable cloudbuild.googleapis.com
   gcloud services enable artifactregistry.googleapis.com
   gcloud services enable secretmanager.googleapis.com
   ```

## Step 1: Create Artifact Registry Repository

```bash
gcloud artifacts repositories create earth-care-food-company \
    --repository-format=docker \
    --location=us-west1 \
    --description="Earth Care Food Company Docker images"
```

## Step 2: Store Secrets in Secret Manager

```bash
# Django Secret Key (generate a strong one)
python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())' | \
gcloud secrets create DJANGO_SECRET_KEY --data-file=-

# Stripe Keys
echo -n "sk_live_your_stripe_secret_key" | gcloud secrets create STRIPE_SECRET --data-file=-
echo -n "pk_live_your_stripe_publishable_key" | gcloud secrets create STRIPE_PUB --data-file=-
echo -n "whsec_your_webhook_secret" | gcloud secrets create STRIPE_WEBHOOK --data-file=-

# SendGrid API Key
echo -n "your_sendgrid_api_key" | gcloud secrets create SENDGRID_KEY --data-file=-

# Gemini API Key
echo -n "your_gemini_api_key" | gcloud secrets create GEMINI_KEY --data-file=-
```

## Step 3: Grant Secret Access to Cloud Build Service Account

```bash
PROJECT_NUMBER=649962693042

gcloud secrets add-iam-policy-binding DJANGO_SECRET_KEY \
    --member=serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com \
    --role=roles/secretmanager.secretAccessor

gcloud secrets add-iam-policy-binding STRIPE_SECRET \
    --member=serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com \
    --role=roles/secretmanager.secretAccessor

gcloud secrets add-iam-policy-binding STRIPE_PUB \
    --member=serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com \
    --role=roles/secretmanager.secretAccessor

gcloud secrets add-iam-policy-binding SENDGRID_KEY \
    --member=serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com \
    --role=roles/secretmanager.secretAccessor

gcloud secrets add-iam-policy-binding GEMINI_KEY \
    --member=serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com \
    --role=roles/secretmanager.secretAccessor
```

## Step 4: Setup Cloud SQL (PostgreSQL) - Recommended for Production

```bash
# Create PostgreSQL instance
gcloud sql instances create earthcare-db \
    --database-version=POSTGRES_14 \
    --tier=db-f1-micro \
    --region=us-west1

# Create database
gcloud sql databases create earthcare_prod --instance=earthcare-db

# Create user
gcloud sql users create earthcare_user \
    --instance=earthcare-db \
    --password=YOUR_STRONG_PASSWORD

# Store database credentials as secrets
echo -n "earthcare_prod" | gcloud secrets create DB_NAME --data-file=-
echo -n "earthcare_user" | gcloud secrets create DB_USER --data-file=-
echo -n "YOUR_STRONG_PASSWORD" | gcloud secrets create DB_PASSWORD --data-file=-
echo -n "/cloudsql/gen-lang-client-0308665609:us-west1:earthcare-db" | gcloud secrets create DB_HOST --data-file=-
```

## Step 5: Update cloudbuild.yaml

If using Cloud SQL, update the deploy step to include database connection:

```yaml
--add-cloudsql-instances=gen-lang-client-0308665609:us-west1:earthcare-db
--set-env-vars=DB_ENGINE=django.db.backends.postgresql
--set-secrets=DB_NAME=DB_NAME:latest,DB_USER=DB_USER:latest,DB_PASSWORD=DB_PASSWORD:latest,DB_HOST=DB_HOST:latest
```

## Step 6: Connect GitHub Repository

1. Go to Cloud Build > Triggers in Google Cloud Console
2. Click "Connect Repository"
3. Select GitHub
4. Authenticate and select your repository: `arrenatedstone/Earth-Care-Food-Company`
5. Create a trigger:
   - Name: `deploy-backend`
   - Event: Push to branch `main`
   - Configuration: Cloud Build configuration file
   - Location: Repository
   - Cloud Build configuration file: `cloudbuild.yaml`

## Step 7: Initial Manual Deploy (Test)

```bash
# Build and deploy backend
gcloud builds submit --config=cloudbuild.yaml

# Get the service URL
gcloud run services describe earth-care-backend \
    --region=us-west1 \
    --format='value(status.url)'
```

## Step 8: Deploy Frontend

### Option A: Cloud Run (Recommended)

Create `cloudbuild-frontend.yaml`:
```yaml
steps:
  - name: 'gcr.io/cloud-builders/docker'
    args:
      - 'build'
      - '-t'
      - 'us-west1-docker.pkg.dev/${PROJECT_ID}/earth-care-food-company/frontend:$COMMIT_SHA'
      - '-f'
      - 'Dockerfile.frontend'
      - '.'
      - '--build-arg'
      - 'VITE_API_BASE_URL=https://earth-care-backend-XXXXX-uw.a.run.app/api'
  
  - name: 'gcr.io/cloud-builders/docker'
    args:
      - 'push'
      - 'us-west1-docker.pkg.dev/${PROJECT_ID}/earth-care-food-company/frontend:$COMMIT_SHA'
  
  - name: 'gcr.io/google.com/cloudsdktool/cloud-sdk'
    entrypoint: gcloud
    args:
      - 'run'
      - 'deploy'
      - 'earth-care-frontend'
      - '--image'
      - 'us-west1-docker.pkg.dev/${PROJECT_ID}/earth-care-food-company/frontend:$COMMIT_SHA'
      - '--region'
      - 'us-west1'
      - '--platform'
      - 'managed'
      - '--allow-unauthenticated'
      - '--port'
      - '8080'
```

Deploy:
```bash
gcloud builds submit --config=cloudbuild-frontend.yaml
```

### Option B: Firebase Hosting (Alternative)

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase
cd frontend
firebase init hosting

# Build frontend
npm run build

# Deploy
firebase deploy --only hosting
```

## Step 9: Setup Custom Domain (earthcare.food)

### Backend API (api.earthcare.food)
```bash
gcloud run domain-mappings create \
    --service=earth-care-backend \
    --domain=api.earthcare.food \
    --region=us-west1
```

Follow the instructions to add DNS records at your domain registrar.

### Frontend (earthcare.food)
```bash
gcloud run domain-mappings create \
    --service=earth-care-frontend \
    --domain=earthcare.food \
    --region=us-west1

gcloud run domain-mappings create \
    --service=earth-care-frontend \
    --domain=www.earthcare.food \
    --region=us-west1
```

## Step 10: Update Django Settings for Production

Update `backend/earthcare/settings.py`:

```python
# Production settings
ALLOWED_HOSTS = config('ALLOWED_HOSTS', default='').split(',')
CSRF_TRUSTED_ORIGINS = [
    'https://earthcare.food',
    'https://www.earthcare.food',
    'https://api.earthcare.food',
    'https://*.run.app',
]

# Security settings
SECURE_SSL_REDIRECT = not DEBUG
SESSION_COOKIE_SECURE = not DEBUG
CSRF_COOKIE_SECURE = not DEBUG
SECURE_HSTS_SECONDS = 31536000 if not DEBUG else 0
SECURE_HSTS_INCLUDE_SUBDOMAINS = not DEBUG
SECURE_HSTS_PRELOAD = not DEBUG
```

## Step 11: Configure Stripe Webhook

1. Go to Stripe Dashboard > Developers > Webhooks
2. Add endpoint: `https://api.earthcare.food/api/store/stripe/webhook/`
3. Select events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
4. Copy webhook signing secret and update secret:
   ```bash
   echo -n "whsec_your_new_webhook_secret" | gcloud secrets versions add STRIPE_WEBHOOK --data-file=-
   ```

## Step 12: Update Frontend Environment Variables

Update `frontend/.env.production`:
```env
VITE_API_BASE_URL=https://api.earthcare.food/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_live_key
```

Then rebuild frontend:
```bash
cd frontend
npm run build
```

## Monitoring & Maintenance

### View Logs
```bash
# Backend logs
gcloud run logs tail earth-care-backend --region=us-west1

# Frontend logs
gcloud run logs tail earth-care-frontend --region=us-west1
```

### Database Backup
```bash
gcloud sql backups create --instance=earthcare-db
```

### Scale Services
```bash
# Set min instances (keeps service warm)
gcloud run services update earth-care-backend \
    --region=us-west1 \
    --min-instances=1

# Set max instances
gcloud run services update earth-care-backend \
    --region=us-west1 \
    --max-instances=10
```

## Cost Optimization

**Free Tier Limits:**
- Cloud Run: 2 million requests/month free
- Cloud SQL: Not free (estimate $7-15/month for db-f1-micro)
- Secret Manager: 6 active secrets free, then $0.06/secret/month
- Cloud Build: 120 build-minutes/day free

**Recommended for Low Traffic:**
- Use SQLite instead of Cloud SQL initially
- Set min-instances=0 (cold starts acceptable for low traffic)
- Use Cloud Build free tier

**Monthly Cost Estimate:**
- Cloud Run: $0-10 (low traffic)
- Cloud SQL: $7-15 (or $0 if using SQLite)
- Total: **$7-25/month**

## Troubleshooting

**Build Fails:**
```bash
# Check build logs
gcloud builds list --limit=5
gcloud builds log [BUILD_ID]
```

**Service Won't Start:**
```bash
# Check service logs
gcloud run logs tail earth-care-backend --region=us-west1

# Check service description
gcloud run services describe earth-care-backend --region=us-west1
```

**Database Connection Issues:**
```bash
# Test Cloud SQL connection
gcloud sql connect earthcare-db --user=earthcare_user
```

## Rollback

```bash
# List revisions
gcloud run revisions list --service=earth-care-backend --region=us-west1

# Rollback to previous revision
gcloud run services update-traffic earth-care-backend \
    --to-revisions=REVISION_NAME=100 \
    --region=us-west1
```

---

**Your deployment is now live!** 🚀

- Backend API: `https://api.earthcare.food`
- Frontend: `https://earthcare.food`
- Admin Panel: `https://api.earthcare.food/admin`
