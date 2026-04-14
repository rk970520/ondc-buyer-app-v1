#!/bin/bash
set -e

SERVER_USER="${SERVER_USER:-root}"
SERVER_HOST="${SERVER_HOST:-72.61.246.147}"
IMAGE_NAME="${IMAGE_NAME:-ondc-buyer-app}"

echo "==> Building Docker image..."
docker build -t "$IMAGE_NAME:latest" .

echo "==> Saving image to tar..."
docker save "$IMAGE_NAME:latest" | gzip > /tmp/image.tar.gz

echo "==> Uploading image to server..."
scp /tmp/image.tar.gz "$SERVER_USER@$SERVER_HOST:/tmp/image.tar.gz"

echo "==> Deploying on server..."
ssh "$SERVER_USER@$SERVER_HOST" bash -s <<'REMOTE'
    set -e

    echo "Loading Docker image..."
    docker load < /tmp/image.tar.gz

    echo "Stopping existing container..."
    docker stop ondc-buyer-app 2>/dev/null || true
    docker rm ondc-buyer-app 2>/dev/null || true

    echo "Starting new container..."
    docker run -d \
        --name ondc-buyer-app \
        --restart unless-stopped \
        -p 80:80 \
        ondc-buyer-app:latest

    echo "Cleaning up..."
    rm -f /tmp/image.tar.gz
    docker image prune -f

    echo "Deployment complete!"
REMOTE

rm -f /tmp/image.tar.gz
echo "==> Done! App is live at http://$SERVER_HOST"
