#!/bin/bash
# SaloneHub Deployment Script
# Builds React app and copies to backend/public

echo "🚀 Building React app..."
cd frontend
npm run build

echo "✅ Build complete! Files are in backend/public/"
echo "📦 Ready to deploy to InfinityFree or any PHP hosting"

