#!/bin/bash

echo "Testing admin API authentication..."

# Check if user is authenticated by testing the /api/admin/users endpoint
echo "Testing without authentication:"
curl -X GET http://localhost:8080/api/admin/users -H "Content-Type: application/json" 2>/dev/null

echo -e "\n\nIf you see the 'Unauthorized' error above, that's expected."
echo "Now let's check if you have a valid JWT token in localStorage..."
echo "Please check your browser's localStorage for 'jwtToken'"

# Test a simple authenticated endpoint
echo -e "\n\nTo test with authentication, try this in your browser console:"
echo "fetch('http://localhost:8080/api/admin/users', {"
echo "  headers: { 'Authorization': 'Bearer ' + localStorage.getItem('jwtToken') }"
echo "}).then(r => r.json()).then(console.log).catch(console.error);"
