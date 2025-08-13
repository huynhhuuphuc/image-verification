#!/bin/sh

# Default PORT to 8080 if not set (Cloud Run requirement)
export PORT=${PORT:-8080}

# Substitute environment variables in nginx config template
envsubst '${PORT}' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf

# Create log directory if it doesn't exist
mkdir -p /var/log/nginx

# Start nginx in foreground
exec nginx -g "daemon off;"
