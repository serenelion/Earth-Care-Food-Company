#!/bin/bash

# Earth Care Food Company - Quick Deploy Script for Google Cloud Run
# Usage: ./deploy.sh [backend|frontend|all]

set -e

PROJECT_ID="gen-lang-client-0308665609"
REGION="us-west1"
REGISTRY="us-west1-docker.pkg.dev"

echo "🌱 Earth Care Food Company - Deployment Script"
echo "=============================================="

# Function to deploy backend
deploy_backend() {
    echo ""
    echo "📦 Building and deploying backend..."
    
    gcloud builds submit \
        --config=cloudbuild.yaml \
        --project=${PROJECT_ID}
    
    echo "✅ Backend deployed successfully!"
    
    # Get backend URL
    BACKEND_URL=$(gcloud run services describe earth-care-backend \
        --region=${REGION} \
        --project=${PROJECT_ID} \
        --format='value(status.url)')
    
    echo "🔗 Backend URL: ${BACKEND_URL}"
}

# Function to deploy frontend
deploy_frontend() {
    echo ""
    echo "🎨 Building frontend locally first..."
    
    cd frontend
    npm run build
    cd ..
    
    echo "📦 Building and deploying frontend Docker image..."
    
    # Build with backend URL
    BACKEND_URL=$(gcloud run services describe earth-care-backend \
        --region=${REGION} \
        --project=${PROJECT_ID} \
        --format='value(status.url)' 2>/dev/null || echo "https://api.earthcare.food")
    
    docker build \
        -t ${REGISTRY}/${PROJECT_ID}/earth-care-food-company/frontend:latest \
        -f Dockerfile.frontend \
        --build-arg VITE_API_BASE_URL="${BACKEND_URL}/api" \
        .
    
    docker push ${REGISTRY}/${PROJECT_ID}/earth-care-food-company/frontend:latest
    
    gcloud run deploy earth-care-frontend \
        --image=${REGISTRY}/${PROJECT_ID}/earth-care-food-company/frontend:latest \
        --region=${REGION} \
        --platform=managed \
        --allow-unauthenticated \
        --port=8080 \
        --project=${PROJECT_ID}
    
    echo "✅ Frontend deployed successfully!"
    
    # Get frontend URL
    FRONTEND_URL=$(gcloud run services describe earth-care-frontend \
        --region=${REGION} \
        --project=${PROJECT_ID} \
        --format='value(status.url)')
    
    echo "🔗 Frontend URL: ${FRONTEND_URL}"
}

# Main deployment logic
case "$1" in
    backend)
        deploy_backend
        ;;
    frontend)
        deploy_frontend
        ;;
    all)
        deploy_backend
        deploy_frontend
        ;;
    *)
        echo "Usage: $0 {backend|frontend|all}"
        echo ""
        echo "Examples:"
        echo "  $0 backend   - Deploy only backend"
        echo "  $0 frontend  - Deploy only frontend"
        echo "  $0 all       - Deploy both backend and frontend"
        exit 1
        ;;
esac

echo ""
echo "🎉 Deployment complete!"
echo ""
echo "📝 Next steps:"
echo "  1. Configure custom domain at Cloud Console"
echo "  2. Update Stripe webhook URL"
echo "  3. Test the deployment"
