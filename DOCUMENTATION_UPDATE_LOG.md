# Documentation Update Log - November 16, 2025

## Overview
Updated API documentation to reflect recent changes to the authentication system and multi-level referral commission structure.

## Files Updated

### 1. **AuthAPI.tsx** - Authentication API Documentation
**Changes Made:**
- Updated request body fields from `username`, `first_name`, `last_name`, `company_name`, `phone`, `country_id` to simplified `email`, `password`, `full_name`
- Added `referral_code` (optional) parameter to registration request
- Updated response fields to include referral-related attributes:
  - `referred_by`: ID of referrer (null if no referral code used)
  - `total_referrals`: Count of L1+L2+L3 referrals
  - `l1_referrals`, `l2_referrals`, `l3_referrals`: Referral counts by level
  - `total_earnings`, `available_balance`: Commission earnings
- Updated error responses to include "Invalid referral code" message
- Added new authentication flow step 1.5: "Referral Code Validation (Optional)"
- Updated step 2 to mention async password hashing and referral tracking
- Removed requirements for company and phone fields

**Impact:** API consumers now understand the simplified registration flow with built-in referral code validation

---

### 2. **ReferralsAPI.tsx** - Referral & Commission API Documentation
**Changes Made:**
- Updated overview section to describe multi-level commission structure (L1, L2, L3)
- Changed commission structure from single-tier to three-level system:
  - **L1 (Direct):** 10-30% commission
  - **L2 (Indirect):** 5-15% commission
  - **L3 (Third-Level):** 2-5% commission
- Added note about commission triggers: "Commissions awarded on initial server purchase and on annual renewals"
- Replaced single "Commission Tiers" section with "Multi-Level Commission Structure" section
- Added detailed example scenario showing how commissions cascade through 3 levels
- Completely rewrote "Referral Flow" section with 8 steps:
  1. Get Referral Code
  2. Prospect Signs Up with Code
  3. Referred Customer Makes Purchase
  4. Commissions Distributed Across Levels (simultaneously)
  5. Commissions Marked as Pending (30-day verification)
  6. Commissions Approved & Confirmed
  7. Request & Receive Payout
  8. Annual Renewal = More Commissions

**Impact:** Affiliates now understand they earn from multiple tiers and get recurring commissions on renewals

---

## Backend Enhancements Documented

### 1. **Async Password Hashing**
- Implementation: `run_in_threadpool` wrapper for bcrypt operations
- Files: `app/utils/security_utils.py`, `app/services/user_service.py`
- Benefit: No event loop blocking, faster registration

### 2. **Referral Code Validation**
- Validates against `AffiliateSubscription` and `Referral` records
- Returns user-friendly error if code is invalid
- Supports both affiliate and legacy referral codes
- Integrated into registration endpoint with instant feedback

### 3. **Multi-Level Commission Distribution**
- Automatic commission calculation on purchase and renewal
- Files: `app/services/affiliate_service.py`, `app/api/v1/endpoints/orders.py`
- Commissions distributed to all three levels simultaneously
- Each level earns independently based on referral relationship

### 4. **Settings Page Enhancement**
- Shows "Invited By" section with inviter name and referral code
- Fetches from `/api/v1/auth/me/inviter` endpoint
- Public endpoint accessible to authenticated users

---

## New Endpoints Documented

### Referral Code Validation Endpoint
```
POST /api/v1/affiliate/validate-code
```
- **Purpose:** Real-time validation of referral codes during signup
- **Request:** `{ "referral_code": "NFFK3NVU" }`
- **Response:** `{ "valid": true, "inviter_name": "John Doe", "code": "NFFK3NVU" }`
- **Used By:** Frontend Signup component for inline validation with icon feedback

---

## Frontend Changes Documented

### Signup Component Features
1. **Referral Code Input:** Optional field with debounced validation (250ms)
2. **Validation Feedback:** 
   - Spinner during validation
   - Green checkmark if code is valid
   - Red X if code is invalid
3. **Inviter Display:** Shows inviter name and code once validated
4. **Three Signup Flows:**
   - Simple: No referral code → Redirects to dashboard
   - With Referral: Provides code → Redirects to dashboard with tracking
   - During Purchase: Server selection → Redirects to checkout with config

### Settings Page Feature
- New "Invited By" section showing:
  - Inviter name
  - Referral code used
  - Level information (L1)

---

## Breaking Changes
⚠️ **Note for API Consumers:**
- Registration endpoint no longer accepts: `username`, `first_name`, `last_name`, `company_name`, `phone`, `country_id`
- Use new fields: `email`, `password`, `full_name`, `referral_code` (optional)
- Response structure now includes referral-related fields
- Password hashing is now async (internal change, no API impact)

---

## Testing Updates

### Test Scenarios Verified ✅
1. **Simple Registration:** User can signup without referral code
2. **Referral Registration:** User can signup with valid referral code, `referred_by` is populated
3. **Invalid Code:** System rejects invalid referral codes with proper error message
4. **Commission Distribution:** Multi-level commissions trigger on server purchase and renewal

### New Test Endpoints
- `POST /api/v1/affiliate/validate-code` - Validate referral codes
- `GET /api/v1/auth/me/inviter` - Fetch inviter information
- `GET /api/v1/auth/me` - Updated response includes referral fields

---

## Documentation Compliance Checklist

- ✅ Authentication API documentation updated
- ✅ Referral API documentation updated  
- ✅ Multi-level commission structure explained
- ✅ New validation endpoint documented
- ✅ Referral flow process clarified
- ✅ Example scenarios provided
- ✅ Backend async improvements noted
- ✅ Frontend signup flows documented

---

## Access Documentation

**Documentation Site:** `http://localhost:5173/docs`

### Available Sections:
- **Getting Started:** `/docs/introduction`
- **API Reference:** `/docs/api/auth`, `/docs/api/referrals`
- **User Guides:** `/docs/user/purchase`
- **Troubleshooting:** `/docs/troubleshooting`
- **Database Schema:** `/docs/database`
- **Deployment:** `/docs/deploy/environment`

---

## Next Steps

1. Review documentation on frontend at `http://localhost:5173/docs`
2. Test signup flows with referral codes
3. Verify multi-level commission distribution on test purchases
4. Monitor referral tracking in Settings page
5. Share referral documentation with affiliates

---

**Last Updated:** November 16, 2025  
**Status:** ✅ Complete - All documentation synced with recent code changes
