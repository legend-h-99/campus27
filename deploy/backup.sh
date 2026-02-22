#!/bin/bash
set -euo pipefail

# ═══════════════════════════════════════════════
# Campus26 - Backup Script
# Usage: ./deploy/backup.sh [backup|restore FILENAME]
# ═══════════════════════════════════════════════

COMPOSE_FILE="docker-compose.prod.yml"
ENV_FILE=".env.production"
BACKUP_DIR="./backups"
RETENTION_DAYS=30

RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

log() { echo -e "${GREEN}[$(date +'%H:%M:%S')]${NC} $1"; }
error() { echo -e "${RED}[$(date +'%H:%M:%S')] ERROR:${NC} $1"; exit 1; }

backup() {
    set -a; source "$ENV_FILE"; set +a

    mkdir -p "$BACKUP_DIR"
    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    FILENAME="campus26_${TIMESTAMP}.sql.gz"

    log "Creating database backup..."
    docker compose -f "$COMPOSE_FILE" exec -T db \
        pg_dump -U "${DB_USER:-campus26}" -d campus26 --clean --if-exists | \
        gzip > "$BACKUP_DIR/$FILENAME"

    SIZE=$(du -sh "$BACKUP_DIR/$FILENAME" | cut -f1)
    log "Backup created: $BACKUP_DIR/$FILENAME ($SIZE)"

    # Clean old backups
    find "$BACKUP_DIR" -name "campus26_*.sql.gz" -mtime +$RETENTION_DAYS -delete 2>/dev/null
    log "Old backups cleaned (retention: ${RETENTION_DAYS} days)"
}

restore() {
    local FILE="$1"
    [ ! -f "$FILE" ] && error "Backup file not found: $FILE"

    set -a; source "$ENV_FILE"; set +a

    log "Restoring from: $FILE"
    echo "This will OVERWRITE the current database. Continue? (y/N)"
    read -r CONFIRM
    [ "$CONFIRM" != "y" ] && exit 0

    gunzip -c "$FILE" | docker compose -f "$COMPOSE_FILE" exec -T db \
        psql -U "${DB_USER:-campus26}" -d campus26

    log "Database restored successfully from $FILE"
}

case "${1:-}" in
    backup)   backup ;;
    restore)
        [ -z "${2:-}" ] && error "Usage: $0 restore FILENAME"
        restore "$2"
        ;;
    *)
        echo "Usage: $0 {backup|restore FILENAME}"
        echo ""
        echo "  backup           - Create a new database backup"
        echo "  restore FILE     - Restore database from backup file"
        exit 1
        ;;
esac
