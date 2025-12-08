#!/bin/bash
# Setup automatic deployments from GitHub to Cloud Run

set -e

PROJECT_ID="gen-lang-client-0308665609"
PROJECT_NUMBER="649962693042"
SERVICE_ACCOUNT="${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com"

echo "🚀 Setting up automatic deployments..."
echo ""

# Grant permissions to Cloud Build service account
echo "📋 Granting permissions to Cloud Build service account..."
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:${SERVICE_ACCOUNT}" \
  --role="roles/run.admin" --quiet

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:${SERVICE_ACCOUNT}" \
  --role="roles/iam.serviceAccountUser" --quiet

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:${SERVICE_ACCOUNT}" \
  --role="roles/secretmanager.secretAccessor" --quiet

echo "✅ Permissions granted!"
echo ""

# Create the trigger via gcloud
echo "🔧 Creating Cloud Build trigger..."
echo ""
echo "Please follow the prompts to connect your GitHub repository."
echo "You'll need to:"
echo "  1. Authorize Google Cloud Build to access your GitHub account"
echo "  2. Select the 'serenelion/Earth-Care-Food-Company' repository"
echo ""

# The trigger creation command
gcloud builds triggers create github \
  --name="earth-care-auto-deploy" \
  --repo-name="Earth-Care-Food-Company" \
  --repo-owner="serenelion" \
  --branch-pattern="^main$" \
  --build-config="cloudbuild.yaml" \
  --region="us-west1" \
  --project="$PROJECT_ID" || {
    echo ""
    echo "⚠️  Automated trigger creation requires GitHub connection."
    echo ""
    echo "Please complete setup manually:"
    echo "1. Go to: https://console.cloud.google.com/cloud-build/triggers?project=$PROJECT_ID"
    echo "2. Click 'CREATE TRIGGER'"
    echo "3. Connect your GitHub repository"
    echo "4. Configure trigger:"
    echo "   - Name: earth-care-auto-deploy"
    echo "   - Repository: serenelion/Earth-Care-Food-Company"
    echo "   - Branch: ^main$"
    echo "   - Build configuration: Cloud Build configuration file (cloudbuild.yaml)"
    echo "   - Location: Repository (cloudbuild.yaml)"
    echo ""
    exit 1
}

echo ""
echo "✅ Automatic deployment setup complete!"
echo ""
echo "From now on, every push to 'main' branch will automatically:"
echo "  1. Build your Docker image"
echo "  2. Push to Artifact Registry"
echo "  3. Deploy to Cloud Run"
echo ""
echo "Monitor builds at:"
echo "https://console.cloud.google.com/cloud-build/builds?project=$PROJECT_ID"
echo ""
