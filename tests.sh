#!/bin/bash
# tests.sh - Simple test script for your Node.js server

set -e

BASE_URL="http://localhost:3000"

# Test root endpoint
curl -i "$BASE_URL/"
echo -e "\n---"

# Test GET /users
curl -i "$BASE_URL/users"
echo -e "\n---"

# Test POST /create
curl -i -X POST "$BASE_URL/create" \
    -H "Content-Type: application/json" \
    -d '{"username":"testuser1","highscore":"49"}'
echo -e "\n---"

# Test GET /users again to see if user was added
curl -i "$BASE_URL/users"
echo -e "\n---"
