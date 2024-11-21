#!/bin/bash

# Make script executable
chmod +x scripts/codespace-init.sh

# Update system and install dependencies
sudo apt-get update
sudo apt-get install -y postgresql postgresql-contrib

# Start PostgreSQL service
sudo service postgresql start

# Setup database
sudo -u postgres psql -c "CREATE DATABASE voting_dashboard;"
sudo -u postgres psql -c "CREATE USER dashboard_user WITH PASSWORD 'your-secure-password';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE voting_dashboard TO dashboard_user;"

# Install node dependencies and run migrations
npm install
npm run migrate

# Create logs directory
mkdir -p logs

echo "CodeSpace initialization completed!"