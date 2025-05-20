#!/bin/bash

# Setup Analytics System
# This script installs the analytics tracking system in a Supabase project

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}===== Portfolio Analytics System Setup =====${NC}"
echo "This script will set up the analytics tracking system in your Supabase project."
echo ""

# Check if supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo -e "${RED}Error: Supabase CLI is not installed${NC}"
    echo "Please install the Supabase CLI first:"
    echo "npm install -g supabase"
    exit 1
fi

# Check if required SQL files exist
if [ ! -f "schema_dump.sql" ]; then
    echo -e "${RED}Error: schema_dump.sql file not found${NC}"
    echo "Please make sure you are running this script from the db directory"
    exit 1
fi

if [ ! -f "analytics_functions.sql" ]; then
    echo -e "${RED}Error: analytics_functions.sql file not found${NC}"
    exit 1
fi

if [ ! -f "analytics_tracker.sql" ]; then
    echo -e "${RED}Error: analytics_tracker.sql file not found${NC}"
    exit 1
fi

echo -e "${YELLOW}Step 1: Loading database schema${NC}"
supabase db reset --db-url YOUR_SUPABASE_DB_URL -f schema_dump.sql || {
    echo -e "${RED}Error: Failed to apply schema${NC}"
    echo "You may need to update the DB URL in this script"
    exit 1
}

echo -e "${YELLOW}Step 2: Loading analytics functions${NC}"
supabase db run --db-url YOUR_SUPABASE_DB_URL -f analytics_functions.sql || {
    echo -e "${RED}Error: Failed to apply analytics functions${NC}"
    exit 1
}

echo -e "${YELLOW}Step 3: Loading tracker functions${NC}"
supabase db run --db-url YOUR_SUPABASE_DB_URL -f analytics_tracker.sql || {
    echo -e "${RED}Error: Failed to apply tracker functions${NC}"
    exit 1
}

echo -e "${GREEN}Setup completed successfully!${NC}"
echo "Your analytics tracking system is now ready to use."
echo ""
echo "You can verify the installation by checking:"
echo "1. Analytics dashboard at /admin"
echo "2. Database tables in Supabase dashboard"
echo ""
echo -e "${YELLOW}Important${NC}: Make sure to update your environment variables with the correct Supabase URL and key."

exit 0 