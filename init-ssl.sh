#!/bin/bash
set -e

DOMAIN="buyer.baniya.app"
EMAIL="${1:?Usage: ./init-ssl.sh your-email@example.com}"
IMAGE_NAME="${IMAGE_NAME:-ghcr.io/rk970520/ondc-buyer-app-v1:latest}"

echo "==> Setting up SSL for ${DOMAIN}..."

# Create required directories
mkdir -p /tmp/certbot-www

# Step 1: Start nginx with a temporary HTTP-only config to serve certbot challenge
echo "==> Starting temporary HTTP server for certificate verification..."
docker stop ondc-buyer-app 2>/dev/null || true
docker rm ondc-buyer-app 2>/dev/null || true

docker run -d \
    --name ondc-buyer-app-temp \
    -p 80:80 \
    -v certbot-www:/var/www/certbot \
    -v certbot-conf:/etc/letsencrypt \
    nginx:alpine \
    sh -c "echo 'server { listen 80; server_name ${DOMAIN}; location /.well-known/acme-challenge/ { root /var/www/certbot; } location / { return 200 \"ok\"; } }' > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"

sleep 3

# Step 2: Request the certificate
echo "==> Requesting SSL certificate from Let's Encrypt..."
docker run --rm \
    -v certbot-conf:/etc/letsencrypt \
    -v certbot-www:/var/www/certbot \
    certbot/certbot certonly \
    --webroot \
    --webroot-path /var/www/certbot \
    --email "${EMAIL}" \
    --agree-tos \
    --no-eff-email \
    -d "${DOMAIN}"

# Step 3: Stop the temporary server
echo "==> Stopping temporary server..."
docker stop ondc-buyer-app-temp && docker rm ondc-buyer-app-temp

# Step 4: Start the real app with SSL
echo "==> Starting app with SSL..."
docker stop ondc-buyer-app 2>/dev/null || true
docker rm ondc-buyer-app 2>/dev/null || true

docker run -d \
    --name ondc-buyer-app \
    --restart unless-stopped \
    -p 80:80 \
    -p 443:443 \
    -v certbot-conf:/etc/letsencrypt \
    -v certbot-www:/var/www/certbot \
    "${IMAGE_NAME}"

echo ""
echo "==> Done! Your app is live at https://${DOMAIN}"
echo ""
echo "To auto-renew certificates, add this cron job:"
echo "  0 0 1 * * docker run --rm -v certbot-conf:/etc/letsencrypt -v certbot-www:/var/www/certbot certbot/certbot renew && docker exec ondc-buyer-app nginx -s reload"
