#!/bin/bash
set -euo pipefail

# ═══════════════════════════════════════════════
# Campus26 - Production Deployment Script
# Usage: ./deploy/deploy.sh [first-run|update|rollback]
# ═══════════════════════════════════════════════

APP_DIR="/opt/campus26"
COMPOSE_FILE="docker-compose.prod.yml"
ENV_FILE=".env.production"
DOMAIN="cranl.com"
EMAIL="admin@cranl.com"  # Change to your email for SSL

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log() { echo -e "${GREEN}[$(date +'%H:%M:%S')]${NC} $1"; }
warn() { echo -e "${YELLOW}[$(date +'%H:%M:%S')] WARNING:${NC} $1"; }
error() { echo -e "${RED}[$(date +'%H:%M:%S')] ERROR:${NC} $1"; exit 1; }

# ── Check prerequisites ──
check_prereqs() {
    command -v docker >/dev/null 2>&1 || error "Docker is not installed"
    command -v docker compose >/dev/null 2>&1 || error "Docker Compose is not installed"

    if [ ! -f "$ENV_FILE" ]; then
        error "$ENV_FILE not found. Copy .env.production.example to $ENV_FILE and fill in values"
    fi
}

# ── First-time setup ──
first_run() {
    log "Starting first-time deployment..."
    check_prereqs

    # Load env
    set -a; source "$ENV_FILE"; set +a

    # Create temp nginx config without SSL for initial certbot
    log "Creating temporary Nginx config for SSL certificate..."
    mkdir -p deploy/nginx/conf.d
    cat > deploy/nginx/conf.d/cranl.conf.tmp << 'TMPNGINX'
server {
    listen 80;
    server_name cranl.com www.cranl.com;
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }
    location / {
        proxy_pass http://app:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
TMPNGINX

    # Temporarily use HTTP-only config
    mv deploy/nginx/conf.d/cranl.conf deploy/nginx/conf.d/cranl.conf.ssl
    mv deploy/nginx/conf.d/cranl.conf.tmp deploy/nginx/conf.d/cranl.conf

    # Build and start services
    log "Building application..."
    docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" build

    log "Starting services..."
    docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" up -d db
    sleep 5

    # Run migrations
    log "Running database migrations..."
    docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" --profile migrate run --rm migrator

    # Seed database
    log "Seeding database..."
    docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" --profile migrate run --rm migrator \
        npx tsx prisma/seed.ts || warn "Seeding failed or already seeded"

    # Start all services
    docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" up -d

    log "Waiting for services to start..."
    sleep 10

    # Get SSL certificate
    log "Obtaining SSL certificate..."
    docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" run --rm certbot \
        certbot certonly --webroot -w /var/www/certbot \
        --email "$EMAIL" --agree-tos --no-eff-email \
        -d "$DOMAIN" -d "www.$DOMAIN" || warn "SSL certificate request failed - will work with HTTP for now"

    # Restore SSL nginx config
    mv deploy/nginx/conf.d/cranl.conf deploy/nginx/conf.d/cranl.conf.tmp
    mv deploy/nginx/conf.d/cranl.conf.ssl deploy/nginx/conf.d/cranl.conf
    rm -f deploy/nginx/conf.d/cranl.conf.tmp

    # Reload nginx with SSL config
    docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" exec nginx nginx -s reload 2>/dev/null || \
        docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" restart nginx

    log "==================================="
    log "  Deployment complete!"
    log "  URL: https://$DOMAIN"
    log "==================================="
}

# ── Update deployment ──
update() {
    log "Starting update deployment..."
    check_prereqs

    set -a; source "$ENV_FILE"; set +a

    # Tag current image for rollback
    CURRENT_IMAGE=$(docker compose -f "$COMPOSE_FILE" images app -q 2>/dev/null || echo "")
    if [ -n "$CURRENT_IMAGE" ]; then
        docker tag "$CURRENT_IMAGE" campus26-app:rollback 2>/dev/null || true
        log "Current image tagged for rollback"
    fi

    # Pull latest code (if using git)
    if [ -d ".git" ]; then
        log "Pulling latest code..."
        git pull origin main
    fi

    # Rebuild app
    log "Rebuilding application..."
    docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" build app

    # Run migrations
    log "Running database migrations..."
    docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" --profile migrate run --rm migrator

    # Restart app with zero-downtime
    log "Restarting application..."
    docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" up -d --no-deps app

    log "Update complete!"
}

# ── Rollback ──
rollback() {
    log "Rolling back to previous version..."

    if docker image inspect campus26-app:rollback >/dev/null 2>&1; then
        docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" stop app
        docker tag campus26-app:rollback campus26-app:latest
        docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" up -d app
        log "Rollback complete!"
    else
        error "No rollback image found"
    fi
}

# ── Main ──
case "${1:-}" in
    first-run)  first_run ;;
    update)     update ;;
    rollback)   rollback ;;
    *)
        echo "Usage: $0 {first-run|update|rollback}"
        echo ""
        echo "  first-run  - Initial deployment (sets up DB, SSL, everything)"
        echo "  update     - Update to latest code version"
        echo "  rollback   - Roll back to previous version"
        exit 1
        ;;
esac
