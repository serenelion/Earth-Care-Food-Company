# Earth Care Food Company - Deployment Guide

## 🚀 Quick Deploy

### Option 1: Manual Deployment (Recommended for now)

```bash
# Make the script executable
chmod +x deploy.sh

# Run the deployment
./deploy.sh
```

This will:
1. Build the Docker image locally
2. Push it to Google Artifact Registry
3. Deploy to Cloud Run
4. Show you the service URL

---

## 🔧 Setting Up Automated GitHub → Cloud Run Deployments

### Step 1: Create Cloud Build Trigger

```bash
# Set your project
gcloud config set project gen-lang-client-0308665609

# Create the trigger
gcloud builds triggers create github \
  --name="earth-care-auto-deploy" \
  --repo-name="Earth-Care-Food-Company" \
  --repo-owner="serenelion" \
  --branch-pattern="^main$" \
  --build-config="cloudbuild.yaml" \
  --region="us-west1"
```

### Step 2: Grant Permissions

```bash
# Get your Cloud Build service account
PROJECT_NUMBER="649962693042"
SERVICE_ACCOUNT="${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com"

# Grant Cloud Run Admin role
gcloud projects add-iam-policy-binding gen-lang-client-0308665609 \
  --member="serviceAccount:${SERVICE_ACCOUNT}" \
  --role="roles/run.admin"

# Grant Service Account User role
gcloud projects add-iam-policy-binding gen-lang-client-0308665609 \
  --member="serviceAccount:${SERVICE_ACCOUNT}" \
  --role="roles/iam.serviceAccountUser"

# Grant Secret Manager accessor
gcloud projects add-iam-policy-binding gen-lang-client-0308665609 \
  --member="serviceAccount:${SERVICE_ACCOUNT}" \
  --role="roles/secretmanager.secretAccessor"
```

### Step 3: Connect GitHub Repository

If not already connected:

```bash
# This will open a browser to connect your GitHub account
gcloud builds connections create github \
  --region=us-west1 \
  --authorizer-token-secret-version=projects/gen-lang-client-0308665609/secrets/github-token/versions/latest
```

Or do it via the Console:
1. Go to [Cloud Build Triggers](https://console.cloud.google.com/cloud-build/triggers)
2. Click **Connect Repository**
3. Select **GitHub** and authenticate
4. Select your repository: `serenelion/Earth-Care-Food-Company`

---

## 📊 Monitoring Deployments

### View Recent Builds

```bash
# List recent builds
gcloud builds list --limit=10

# Watch a build in real-time (use the build ID from above)
gcloud builds log <BUILD_ID> --stream
```

### View Build Logs

```bash
# Get logs for the most recent build
gcloud builds list --limit=1 --format="value(id)" | xargs gcloud builds log

# Or view in browser
open "https://console.cloud.google.com/cloud-build/builds"
```

### Check Service Status

```bash
# Get service details
gcloud run services describe earth-care-backend --region=us-west1

# Get service URL
gcloud run services describe earth-care-backend \
  --region=us-west1 \
  --format="value(status.url)"

# View service logs
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=earth-care-backend" \
  --limit=50 \
  --format=json
```

### Trigger Manual Build from GitHub

```bash
# List triggers
gcloud builds triggers list

# Run a trigger manually
gcloud builds triggers run earth-care-auto-deploy \
  --branch=main
```

---

## 🔍 Troubleshooting Current Build Error

The error you're seeing is because Cloud Build is looking for `Dockerfile` instead of `Dockerfile.backend`.

### Fix the Trigger Configuration:

1. Go to [Cloud Build Triggers](https://console.cloud.google.com/cloud-build/triggers)
2. Find your trigger
3. Click **EDIT**
4. Under **Build Configuration**:
   - **Type**: Cloud Build configuration file
   - **Location**: Repository → `cloudbuild.yaml`
5. **Remove any Dockerfile path override**
6. Click **SAVE**

### Alternatively, delete and recreate:

```bash
# Delete the old trigger (if it exists)
gcloud builds triggers delete <TRIGGER_NAME> --region=us-west1

# Create new one with correct config
gcloud builds triggers create github \
  --name="earth-care-deploy" \
  --repo-name="Earth-Care-Food-Company" \
  --repo-owner="serenelion" \
  --branch-pattern="^main$" \
  --build-config="cloudbuild.yaml" \
  --region="us-west1"
```

---

## 🔄 Complete Deployment Workflow

### For Development:

```bash
# 1. Make changes
git add .
git commit -m "Your changes"

# 2. Test locally
cd backend
python manage.py runserver

cd ../frontend
npm run dev

# 3. When ready to deploy
git push origin main

# 4. Monitor the build
gcloud builds list --ongoing
```

### For Production:

```bash
# Use the deploy script for manual control
./deploy.sh

# Or trigger via GitHub
git push origin main
# Then watch logs:
gcloud builds list --limit=1 --format="value(id)" | xargs gcloud builds log --stream
```

---

## 📱 Mobile Monitoring

Install Google Cloud Console app:
- [iOS](https://apps.apple.com/app/google-cloud-console/id1005120814)
- [Android](https://play.google.com/store/apps/details?id=com.google.android.apps.cloudconsole)

Get push notifications for build status!

---

## 🆘 Quick Commands Reference

```bash
# Check project
gcloud config get-value project

# List services
gcloud run services list

# View recent builds
gcloud builds list --limit=5

# Stream build logs
gcloud builds log <BUILD_ID> --stream

# Get service URL
gcloud run services describe earth-care-backend --region=us-west1 --format="value(status.url)"

# View application logs
gcloud logging read "resource.type=cloud_run_revision" --limit=50

# Rollback deployment
gcloud run services update-traffic earth-care-backend --to-revisions=PREVIOUS=100 --region=us-west1
```

---

## 🔐 Secrets Management

```bash
# List secrets
gcloud secrets list

# Update a secret
echo -n "new-secret-value" | gcloud secrets versions add SECRET_NAME --data-file=-

# View secret metadata
gcloud secrets describe DJANGO_SECRET_KEY
```

---

## 🌐 Custom Domain Setup

```bash
# Map domain to service
gcloud run domain-mappings create \
  --service=earth-care-backend \
  --domain=earthcare.food \
  --region=us-west1

# Verify domain mapping
gcloud run domain-mappings describe \
  --domain=earthcare.food \
  --region=us-west1
```
