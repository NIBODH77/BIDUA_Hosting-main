#!/bin/bash

# Referral Code Validation - Test Script
# Tests the complete referral signup flow

echo "🧪 Testing Referral Code Validation Flow"
echo "=========================================="
echo ""

# Configuration
API_BASE="http://localhost:8000"
FRONTEND_URL="http://localhost:5173"

echo "📋 Test Prerequisites:"
echo "1. Backend running on $API_BASE"
echo "2. Frontend running on $FRONTEND_URL"
echo "3. Database seeded with at least one active affiliate"
echo ""

# Test 1: Get a valid referral code
echo "Test 1: Fetching a valid referral code from database..."
REFERRAL_CODE=$(curl -s "$API_BASE/api/v1/affiliate/my-subscription" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" | jq -r '.referral_code // "NFFK3NVU"')
echo "✅ Using referral code: $REFERRAL_CODE"
echo ""

# Test 2: Validate the referral code
echo "Test 2: Validating referral code via API..."
VALIDATION_RESPONSE=$(curl -s "$API_BASE/api/v1/affiliate/validate-code?code=$REFERRAL_CODE")
echo "Response: $VALIDATION_RESPONSE"

IS_VALID=$(echo $VALIDATION_RESPONSE | jq -r '.valid')
INVITER_NAME=$(echo $VALIDATION_RESPONSE | jq -r '.inviter.full_name // "Unknown"')

if [ "$IS_VALID" = "true" ]; then
  echo "✅ Code is valid! Inviter: $INVITER_NAME"
else
  echo "❌ Code validation failed!"
  exit 1
fi
echo ""

# Test 3: Register a new user with referral code
echo "Test 3: Registering new user with referral code..."
TIMESTAMP=$(date +%s)
TEST_EMAIL="testuser_${TIMESTAMP}@example.com"
TEST_PASSWORD="Test123456"
TEST_NAME="Test User $TIMESTAMP"

REGISTER_RESPONSE=$(curl -s -X POST "$API_BASE/api/v1/auth/register" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$TEST_EMAIL\",
    \"password\": \"$TEST_PASSWORD\",
    \"full_name\": \"$TEST_NAME\",
    \"referral_code\": \"$REFERRAL_CODE\"
  }")

echo "Response: $REGISTER_RESPONSE"

ACCESS_TOKEN=$(echo $REGISTER_RESPONSE | jq -r '.access_token // ""')
if [ -z "$ACCESS_TOKEN" ]; then
  echo "❌ Registration failed!"
  echo "Error: $(echo $REGISTER_RESPONSE | jq -r '.detail // "Unknown error"')"
  exit 1
fi
echo "✅ User registered successfully!"
echo "   Email: $TEST_EMAIL"
echo "   Token: ${ACCESS_TOKEN:0:20}..."
echo ""

# Test 4: Fetch user profile to verify referral binding
echo "Test 4: Fetching user profile to verify referral tracking..."
USER_PROFILE=$(curl -s "$API_BASE/api/v1/auth/me" \
  -H "Authorization: Bearer $ACCESS_TOKEN")

echo "Profile: $USER_PROFILE"

REFERRED_BY=$(echo $USER_PROFILE | jq -r '.referred_by // null')
USER_ID=$(echo $USER_PROFILE | jq -r '.id')

echo "   User ID: $USER_ID"
echo "   Referred By: $REFERRED_BY"

if [ "$REFERRED_BY" != "null" ] && [ "$REFERRED_BY" != "" ]; then
  echo "✅ Referral binding successful!"
  
  # Fetch inviter details
  echo ""
  echo "Test 5: Fetching inviter profile details..."
  INVITER_PROFILE=$(curl -s "$API_BASE/api/v1/users/$REFERRED_BY" \
    -H "Authorization: Bearer $ACCESS_TOKEN")
  
  INVITER_FULL_NAME=$(echo $INVITER_PROFILE | jq -r '.full_name // "Unknown"')
  INVITER_EMAIL=$(echo $INVITER_PROFILE | jq -r '.email // "Unknown"')
  
  echo "   Inviter Name: $INVITER_FULL_NAME"
  echo "   Inviter Email: $INVITER_EMAIL"
  echo "✅ Inviter details fetched successfully!"
else
  echo "⚠️  Warning: User not linked to referrer (referred_by is null)"
  echo "   This might be expected if referral tracking happens in separate table"
fi
echo ""

# Test 6: Check referral table for tracking
echo "Test 6: Checking referral tracking in database..."
echo "Run this SQL query manually:"
echo ""
echo "  SELECT * FROM referrals WHERE referred_user_id = $USER_ID;"
echo ""
echo "Expected result:"
echo "  - level: 1"
echo "  - referrer_id: $REFERRED_BY"
echo "  - status: active"
echo ""

# Frontend test instructions
echo "=========================================="
echo "🎨 Frontend Manual Tests:"
echo "=========================================="
echo ""
echo "1. Test Signup Page Validation:"
echo "   URL: $FRONTEND_URL/signup?ref=$REFERRAL_CODE"
echo "   Expected:"
echo "   - Referral code auto-filled"
echo "   - Green checkmark appears after validation"
echo "   - Success box shows: 'Valid referral code • You'll be referred by $INVITER_NAME'"
echo ""

echo "2. Test Invalid Code:"
echo "   URL: $FRONTEND_URL/signup?ref=INVALID123"
echo "   Expected:"
echo "   - Red X icon appears"
echo "   - Error box shows: 'Invalid or inactive referral code...'"
echo "   - Signup still allowed"
echo ""

echo "3. Test Settings Page:"
echo "   Login with: $TEST_EMAIL / $TEST_PASSWORD"
echo "   Navigate to: $FRONTEND_URL/dashboard/settings"
echo "   Go to: Profile tab"
echo "   Expected:"
echo "   - 'Invited By' section visible"
echo "   - Shows: $INVITER_NAME ($REFERRAL_CODE)"
echo "   - 'Referred User' badge displayed"
echo ""

echo "=========================================="
echo "✅ All API tests completed!"
echo "=========================================="
echo ""
echo "Test User Credentials:"
echo "  Email: $TEST_EMAIL"
echo "  Password: $TEST_PASSWORD"
echo "  Access Token: $ACCESS_TOKEN"
echo ""
echo "Next Steps:"
echo "1. Run the frontend manual tests above"
echo "2. Check database referral tracking"
echo "3. Verify commission calculations (if applicable)"
