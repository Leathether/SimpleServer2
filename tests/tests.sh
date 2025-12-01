#!/bin/bash
# tests.sh - Simple test script for your Node.js server

echo "Starting tests..."

# Test 1: Check if server is running
code=$(curl -s -w "%{http_code}" -X GET "http://localhost:3000/" \
    -H "Content-Type: application/json" \
    -d '{}')
echo "Test 1 response == $code"

# Test 2: Fetch users without authentication (GET)
code=$(curl -s  -w "%{http_code}" -X GET "http://localhost:3000/users" \
    -H "Content-Type: application/json" \
    -d '{}')
echo "Test 2: GET /users returned HTTP $code"

# Test 3: Create a new user with POST /create
code=$(curl -s  -w "%{http_code}" -X POST "http://localhost:3000/create" \
    -H "Content-Type: application/json" \
    -d '{"username":"testUser5","userPassword":"testPass","powerLevel":"normal","score":100}')
echo "Test 3: POST /create returned HTTP $code"

# Test 4: Login with admin key to get token (POST)
response=$(curl -s -X POST "http://localhost:3000/login" \
    -H "Content-Type: application/json" \
    -d '{"username":"adminUser","password":"adminPass123"}')
token=$(echo $response | jq -r '.token')
key=$(echo $response | jq -r '.password')
echo "Test 4: POST /login returned token: $token"
echo "Test 4: POST /login returned key: $key"

# Test 5: Attempt to fetch specific user data with admin credentials (GET)
# If your API expects credentials in headers or body, adjust accordingly.
code=$(curl -s -w "%{http_code}" -X GET "http://localhost:3000/users/specUser" \
    -H "Authorization: Bearer $token" \
    -H "Content-Type: application/json"  \
    -d '{"token":"'$token'","password":"'$key'", "usernameRequested":"testUser5"}'
    )
echo "Test 5: GET /users/specUser with admin credentials returned HTTP $code"

echo "Tests completed."

# Test 6: Attempt to delete a user with admin credentials (DELETE)
code=$(curl -s -w "%{http_code}" -X DELETE "http://localhost:3000/delete" \
    -H "Authorization: Bearer $token" \
    -H "Content-Type: application/json" \
    -d '{"usernameDelete":"testUser5","usernameIs":"adminUser","token":"'$token'","password":"'$key'"}')
echo "Test 6: DELETE /delete with admin credentials returned HTTP $code"
