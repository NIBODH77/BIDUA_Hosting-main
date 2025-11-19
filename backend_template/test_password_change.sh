#!/bin/bash

# First, login to get token
echo "Logging in..."
LOGIN_RESPONSE=$(curl -s -X POST "http://localhost:8000/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "devtest@gmail.com", "password": "123456"}')

TOKEN=$(echo $LOGIN_RESPONSE | python3 -c "import sys, json; print(json.load(sys.stdin).get('access_token', ''))")

if [ -z "$TOKEN" ]; then
  echo "Login failed"
  exit 1
fi

echo "Login successful, token obtained"

# Try to change password
echo "Attempting to change password..."
CHANGE_RESPONSE=$(curl -s -X POST "http://localhost:8000/api/v1/auth/change-password" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "current_password": "123456",
    "new_password": "newpassword123"
  }')

echo "Response: $CHANGE_RESPONSE"

# Verify new password works
echo "Testing new password..."
NEW_LOGIN=$(curl -s -X POST "http://localhost:8000/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "devtest@gmail.com", "password": "newpassword123"}')

if echo "$NEW_LOGIN" | grep -q "access_token"; then
  echo "✅ Password change successful!"
  
  # Change it back
  echo "Changing password back to original..."
  NEW_TOKEN=$(echo $NEW_LOGIN | python3 -c "import sys, json; print(json.load(sys.stdin).get('access_token', ''))")
  curl -s -X POST "http://localhost:8000/api/v1/auth/change-password" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $NEW_TOKEN" \
    -d '{"current_password": "newpassword123", "new_password": "123456"}'
  echo ""
  echo "Password restored to original"
else
  echo "❌ Password change failed"
fi
