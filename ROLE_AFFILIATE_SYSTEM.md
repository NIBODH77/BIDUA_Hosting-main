# Role-Based System & Affiliate Program Implementation

## Overview
This document outlines the complete role-based access control (RBAC) system and multi-level affiliate/referral program for the hosting platform.

---

## Departments Structure

### 1. **Executive Department** (`EXEC`)
- **Purpose**: Top-level management and strategic decisions
- **Roles**:
  - **CEO/Founder** - Overall business oversight
  - **COO** - Operations management
  - **CFO** - Financial oversight

### 2. **Technology Department** (`TECH`)
- **Purpose**: System development, maintenance, and infrastructure
- **Roles**:
  - **CTO** - Technology strategy
  - **System Administrator** - Server management and infrastructure
  - **DevOps Engineer** - Deployment and automation
  - **Backend Developer** - API and database development
  - **Frontend Developer** - UI/UX implementation
  - **Security Engineer** - Security and compliance

### 3. **Customer Support Department** (`SUPPORT`)
- **Purpose**: Customer service and technical support
- **Roles**:
  - **Support Manager** - Support team oversight
  - **Senior Support Agent** - Complex issue resolution
  - **Support Agent** - General customer queries
  - **Technical Support Specialist** - Technical troubleshooting

### 4. **Sales & Marketing Department** (`SALES`)
- **Purpose**: Revenue generation and customer acquisition
- **Roles**:
  - **Sales Manager** - Sales team oversight
  - **Sales Executive** - Direct sales
  - **Marketing Manager** - Marketing strategy
  - **Content Creator** - Marketing content
  - **SEO Specialist** - Organic growth

### 5. **Affiliate Management Department** (`AFFILIATE_MGMT`)
- **Purpose**: Manage affiliate program and partnerships
- **Roles**:
  - **Affiliate Manager** - Program oversight
  - **Affiliate Support Specialist** - Affiliate assistance
  - **Commission Analyst** - Track and calculate commissions

### 6. **Finance & Billing Department** (`FINANCE`)
- **Purpose**: Financial operations and billing management
- **Roles**:
  - **Finance Manager** - Financial oversight
  - **Billing Specialist** - Invoice and billing management
  - **Accountant** - Financial records
  - **Payout Manager** - Affiliate payout processing

### 7. **Product Management Department** (`PRODUCT`)
- **Purpose**: Product strategy and development
- **Roles**:
  - **Product Manager** - Product roadmap
  - **Product Analyst** - Data analysis and insights

### 8. **Quality Assurance Department** (`QA`)
- **Purpose**: Testing and quality control
- **Roles**:
  - **QA Manager** - QA team oversight
  - **QA Engineer** - Testing and quality assurance

### 9. **Compliance & Legal Department** (`LEGAL`)
- **Purpose**: Legal compliance and risk management
- **Roles**:
  - **Compliance Officer** - Regulatory compliance
  - **Legal Advisor** - Legal matters

---

## Role Permissions Matrix

### Resource Types:
- `user` - User management
- `server` - Server management
- `billing` - Billing and invoices
- `affiliate` - Affiliate program
- `commission` - Commission management
- `payout` - Payout processing
- `order` - Order management
- `support_ticket` - Support tickets
- `department` - Department management
- `role` - Role management
- `permission` - Permission management
- `analytics` - System analytics

### Permission Actions:
- `create` - Create new records
- `read` - View records
- `update` - Modify records
- `delete` - Delete records
- `approve` - Approve requests
- `manage` - Full management access

### System Roles and Their Permissions:

#### 1. **SUPER_ADMIN**
- All permissions on all resources
- Cannot be deleted (system role)

#### 2. **ADMIN**
- Full access except system configuration
- Permissions: All resources (create, read, update, delete)

#### 3. **AFFILIATE** (Standard affiliate user)
- `affiliate.read` - View own affiliate data
- `commission.read` - View own commissions
- `payout.create` - Request payouts
- `payout.read` - View own payout history
- `referral.read` - View referral tree
- `user.read` - View referred users (limited)

#### 4. **AFFILIATE_MANAGER**
- All affiliate permissions
- `affiliate.manage` - Manage all affiliates
- `commission.approve` - Approve commissions
- `payout.manage` - Process payouts
- `analytics.read` - View affiliate analytics

#### 5. **SUPPORT_AGENT**
- `support_ticket.read`
- `support_ticket.update`
- `user.read`
- `server.read`
- `billing.read`

#### 6. **SUPPORT_MANAGER**
- All support agent permissions
- `support_ticket.manage`
- `user.update`
- `server.update`

#### 7. **SALES_EXECUTIVE**
- `user.read`
- `order.create`
- `order.read`
- `billing.read`

#### 8. **BILLING_SPECIALIST**
- `billing.read`
- `billing.update`
- `order.read`
- `invoice.manage`

#### 9. **PAYOUT_MANAGER**
- `payout.read`
- `payout.approve`
- `payout.update`
- `commission.read`

---

## Affiliate Program Structure

### Subscription Model

#### Option 1: Paid Subscription (₹499)
- One-time payment of ₹499
- Lifetime affiliate access
- Immediate referral link activation
- No server purchase required

#### Option 2: Free with Server Purchase
- Buy any server/hosting plan
- Automatic affiliate activation
- Lifetime affiliate access FREE
- No ₹499 subscription fee

### Multi-Level Referral System (3 Levels)

```
Level 1 (Direct Referrals)
├── Commission: Higher % (e.g., 15-25%)
├── Track all direct sign-ups
└── Earn on their purchases

Level 2 (Referrals of Your Referrals)
├── Commission: Medium % (e.g., 8-15%)
├── Track indirect referrals
└── Earn on their purchases

Level 3 (Third Level Referrals)
├── Commission: Lower % (e.g., 3-8%)
├── Track third-level referrals
└── Earn on their purchases
```

### Commission Structure Example

#### Server/Hosting Plans:
- **Level 1**: 20% of purchase amount
- **Level 2**: 10% of purchase amount
- **Level 3**: 5% of purchase amount

#### Domains:
- **Level 1**: ₹100 per domain
- **Level 2**: ₹50 per domain
- **Level 3**: ₹25 per domain

#### Add-ons/Services:
- **Level 1**: 15% of purchase amount
- **Level 2**: 8% of purchase amount
- **Level 3**: 4% of purchase amount

### Affiliate Dashboard Features

#### 1. **Overview Section**
- Total earnings (all-time)
- Available balance
- Pending commissions
- Total referrals (all levels)
- Active referrals count

#### 2. **Referral Tree View**
- **Level 1**: Direct referrals
  - Name/Email
  - Signup date
  - Total purchases
  - Commission earned from them
  - Status (active/inactive)
  
- **Level 2**: Second level referrals
  - Parent (Level 1 referrer)
  - Referral details
  - Purchases and commissions
  
- **Level 3**: Third level referrals
  - Parent chain (Level 1 → Level 2 → Level 3)
  - Referral details
  - Purchases and commissions

#### 3. **Server Details Tracking**
For each referral at all levels:
- Server plan purchased
- Purchase date
- Amount
- Commission earned
- Server status (active/cancelled)

#### 4. **Commission Tracking**
- **Pending**: Awaiting approval
- **Approved**: Approved but not paid
- **Paid**: Successfully paid out
- Filters by date, level, status

#### 5. **Expected Payout Calculator**
- Current pending commissions
- Projected earnings
- Based on referral activity

#### 6. **Payout History**
- All past payouts
- Date, amount, method
- Transaction ID/reference
- Status tracking

#### 7. **Referral Link Management**
- Unique referral code
- Shareable links
- QR code generation
- Click tracking
- Conversion rate

---

## Database Schema

### Tables Created:

1. **departments** - Department hierarchy
2. **roles** - System roles
3. **permissions** - Granular permissions
4. **role_permissions** - Role-permission mapping
5. **user_roles** - User-role assignments
6. **user_departments** - User-department assignments
7. **affiliate_subscriptions** - Affiliate account subscriptions
8. **referrals** - Referral relationships (3 levels)
9. **commission_rules** - Commission rate configuration
10. **commissions** - Individual commission records
11. **payouts** - Payout requests and history
12. **affiliate_stats** - Cached affiliate statistics

---

## API Endpoints

### Role Management
- `POST /api/v1/roles` - Create role
- `GET /api/v1/roles` - List roles
- `GET /api/v1/roles/{id}` - Get role details
- `PUT /api/v1/roles/{id}` - Update role
- `DELETE /api/v1/roles/{id}` - Delete role
- `POST /api/v1/roles/{id}/permissions` - Assign permissions

### Department Management
- `POST /api/v1/departments` - Create department
- `GET /api/v1/departments` - List departments
- `GET /api/v1/departments/{id}` - Get department details
- `PUT /api/v1/departments/{id}` - Update department

### Affiliate Management
- `POST /api/v1/affiliate/subscribe` - Subscribe to affiliate program
- `GET /api/v1/affiliate/dashboard` - Get affiliate dashboard data
- `GET /api/v1/affiliate/referrals` - Get referral tree
- `GET /api/v1/affiliate/referrals/level/{level}` - Get specific level referrals
- `GET /api/v1/affiliate/stats` - Get affiliate statistics
- `GET /api/v1/affiliate/link` - Get referral link

### Commission Management
- `GET /api/v1/commissions` - List commissions
- `GET /api/v1/commissions/pending` - Get pending commissions
- `GET /api/v1/commissions/stats` - Get commission statistics
- `POST /api/v1/commissions/{id}/approve` - Approve commission (admin)

### Payout Management
- `POST /api/v1/payouts/request` - Request payout
- `GET /api/v1/payouts` - List payouts
- `GET /api/v1/payouts/history` - Get payout history
- `POST /api/v1/payouts/{id}/process` - Process payout (admin)

---

## Business Logic

### Affiliate Activation Flow

1. **User Signs Up**
2. **Choose Path**:
   - Path A: Pay ₹499 → Instant activation
   - Path B: Buy server → Free activation
3. **Generate unique referral code**
4. **Activate affiliate account**
5. **Generate referral links**
6. **User can start referring**

### Referral Tracking Flow

1. **Prospect clicks referral link**
2. **Store referral code in session/cookie**
3. **Prospect signs up**
4. **Create referral record**
5. **Determine level** (1, 2, or 3)
6. **Link to parent referrals**
7. **Track conversion on purchase**

### Commission Calculation Flow

1. **User makes purchase** (referred user)
2. **Identify all upline affiliates** (up to 3 levels)
3. **For each level**:
   - Get applicable commission rule
   - Calculate commission amount
   - Create commission record
   - Update affiliate stats
4. **Set commission to PENDING**
5. **Admin approval** → APPROVED
6. **Include in payout** → PAID

### Payout Processing Flow

1. **Affiliate requests payout**
2. **Check minimum balance** (e.g., ₹500)
3. **Verify approved commissions**
4. **Create payout request**
5. **Admin reviews**
6. **Process payment**
7. **Update commission status to PAID**
8. **Update payout status to COMPLETED**

---

## Performance Optimization

### 1. **Caching Strategy**
- Cache affiliate stats (refresh every hour)
- Cache referral tree (refresh on change)
- Cache commission rules

### 2. **Indexing**
- Index on `referrer_id`, `referred_user_id`
- Index on `affiliate_user_id`
- Index on `status` fields
- Composite index on `user_id + level`

### 3. **Batch Processing**
- Calculate commissions in background jobs
- Update stats asynchronously
- Process payouts in batches

---

## Security Considerations

1. **Referral Code Generation**
   - Unique, random, non-guessable codes
   - 8-12 characters, alphanumeric
   - Check uniqueness before saving

2. **Fraud Prevention**
   - Detect self-referrals
   - Monitor suspicious patterns
   - IP tracking for sign-ups
   - Cooldown period for payouts

3. **Access Control**
   - Strict role-based permissions
   - Users can only view their own data
   - Admins have full access
   - Audit logging for all actions

---

## Frontend Components Needed

1. **Affiliate Dashboard**
2. **Referral Tree Visualization**
3. **Commission Tracker**
4. **Payout Request Form**
5. **Referral Link Share Component**
6. **Statistics Cards**
7. **Department Management UI** (Admin)
8. **Role Management UI** (Admin)
9. **Permission Matrix UI** (Admin)
10. **Payout Processing UI** (Admin)

---

## Implementation Timeline

### Phase 1: Database & Backend (Week 1-2)
- ✅ Create database models
- ✅ Create migrations
- Create services layer
- Create API endpoints
- Implement commission calculation logic

### Phase 2: Admin Portal (Week 3)
- Role management UI
- Department management UI
- Permission assignment
- Payout processing interface

### Phase 3: Affiliate Portal (Week 4)
- Affiliate dashboard
- Referral tree view
- Commission tracking
- Payout request
- Referral link sharing

### Phase 4: Integration & Testing (Week 5)
- Integrate with order system
- Testing all flows
- Performance optimization
- Security audit

### Phase 5: Launch (Week 6)
- Deploy to production
- Monitor and fix issues
- Gather feedback
- Iterate and improve

---

## Next Steps

1. Create database migrations for all tables
2. Implement service layer for each module
3. Create API endpoints
4. Build frontend components
5. Test end-to-end flows
6. Deploy and monitor
