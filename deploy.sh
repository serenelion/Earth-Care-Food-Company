#!/bin/bash
# Earth Care Food Company - Deployment Script
# This script helps you deploy to Google Cloud Run

set -e

PROJECT_ID="gen-lang-client-0308665609"
REGION="us-west1"
SERVICE_NAME="earth-care-backend"
REPO_NAME="earth-care-food-company"

echo "🌿 Earth Care Food Company - Cloud Deployment"
echo "=============================================="
echo ""

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ gcloud CLI not found. Please install it first:"
    echo "   https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Set the project
echo "📍 Setting project to: $PROJECT_ID"
gcloud config set project $PROJECT_ID

# Build and push the Docker image
COMMIT_SHA=$(git rev-parse HEAD)
IMAGE_NAME="us-west1-docker.pkg.dev/$PROJECT_ID/$REPO_NAME/backend:$COMMIT_SHA"

echo ""
echo "🔨 Building Docker image..."
echo "   Image: $IMAGE_NAME"
docker build -t $IMAGE_NAME -f Dockerfile.backend .

echo ""
echo "📤 Pushing image to Artifact Registry..."
docker push $IMAGE_NAME

echo ""
echo "🚀 Deploying to Cloud Run..."
gcloud run deploy $SERVICE_NAME \
  --image $IMAGE_NAME \
  --region $REGION \
  --platform managed \
  --allow-unauthenticated \
  --set-env-vars "DEBUG=False,ALLOWED_HOSTS=.run.app,.earthcare.food,earthcare.food" \
  --set-secrets "SECRET_KEY=DJANGO_SECRET_KEY:latest,STRIPE_SECRET_KEY=STRIPE_SECRET:latest,STRIPE_PUBLISHABLE_KEY=STRIPE_PUB:latest,SENDGRID_API_KEY=SENDGRID_KEY:latest,GEMINI_API_KEY=GEMINI_KEY:latest" \
  --min-instances 0 \
  --max-instances 10 \
  --memory 512Mi \
  --cpu 1 \
  --port 8080

echo ""
echo "✅ Deployment complete!"
echo ""
echo "🌐 Service URL:"
gcloud run services describe $SERVICE_NAME --region $REGION --format="value(status.url)"
echo ""
