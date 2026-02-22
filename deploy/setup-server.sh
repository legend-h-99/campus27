#!/bin/bash
set -euo pipefail

# ═══════════════════════════════════════════════
# Campus26 - Server Initial Setup (Ubuntu 22.04/24.04)
# Run on a fresh VPS as root
# Usage: bash setup-server.sh
# ═══════════════════════════════════════════════

GREEN='\033[0;32m'
NC='\033[0m'
log() { echo -e "${GREEN}[SETUP]${NC} $1"; }

log "Updating system packages..."
apt update && apt upgrade -y

log "Installing essential tools..."
apt install -y curl wget git ufw fail2ban htop

# ── Docker ──
log "Installing Docker..."
curl -fsSL https://get.docker.com | sh

log "Installing Docker Compose plugin..."
apt install -y docker-compose-plugin

# ── Firewall ──
log "Configuring firewall..."
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 80/tcp
ufw allow 443/tcp
echo "y" | ufw enable

# ── Fail2Ban (brute-force protection) ──
log "Configuring Fail2Ban..."
systemctl enable fail2ban
systemctl start fail2ban

# ── Create app user ──
log "Creating deploy user..."
useradd -m -s /bin/bash deploy 2>/dev/null || true
usermod -aG docker deploy

# ── Create app directory ──
log "Setting up application directory..."
mkdir -p /opt/campus26
chown deploy:deploy /opt/campus26

# ── Swap (for small VPS) ──
if [ ! -f /swapfile ]; then
    log "Creating 2GB swap file..."
    fallocate -l 2G /swapfile
    chmod 600 /swapfile
    mkswap /swapfile
    swapon /swapfile
    echo '/swapfile none swap sw 0 0' >> /etc/fstab
fi

# ── Cron for backups ──
log "Setting up daily backup cron..."
cat > /etc/cron.d/campus26-backup << 'CRON'
# Daily backup at 3:00 AM (Saudi time = UTC+3 → 00:00 UTC)
0 0 * * * deploy cd /opt/campus26 && ./deploy/backup.sh backup >> /var/log/campus26-backup.log 2>&1
CRON

# ── Auto security updates ──
log "Enabling automatic security updates..."
apt install -y unattended-upgrades
dpkg-reconfigure -plow unattended-upgrades

log "==================================="
log "  Server setup complete!"
log ""
log "  Next steps:"
log "  1. Copy project to /opt/campus26/"
log "  2. cp .env.production.example .env.production"
log "  3. Edit .env.production with real values"
log "  4. chmod +x deploy/*.sh"
log "  5. ./deploy/deploy.sh first-run"
log "==================================="
