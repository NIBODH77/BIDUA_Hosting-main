# Professional Ticketing System - Complete Guide

## Overview
A comprehensive support ticket management system with role-based access, employee assignment, message threading, and status tracking.

## Features

### ✅ User Features
- **Create Support Tickets**: Submit tickets with subject, priority, department, and detailed description
- **Track Ticket Status**: Monitor tickets through Open → In Progress → Closed lifecycle
- **Message Threading**: Reply to tickets and view conversation history
- **Status Filtering**: Filter tickets by status (Open, In Progress, Closed)
- **Search Functionality**: Search tickets by subject or ticket number
- **Ticket Details**: View full ticket history including all messages and status changes
- **Close Tickets**: Users can close their own resolved tickets

### ✅ Admin Features
- **View All Tickets**: See all support tickets across all customers
- **Advanced Filtering**: Filter by status, priority, assigned employee, department
- **Assign Tickets**: Assign tickets to support employees
- **Status Management**: Update ticket status (Open/In Progress/Closed)
- **Staff Replies**: Respond to customer tickets (marked as staff replies)
- **Internal Notes**: Add internal notes not visible to customers
- **Employee Workload**: View active ticket count per employee
- **Search & Sort**: Advanced search across tickets, customers, and ticket numbers

### ✅ Support Employee Features
- **Assigned Tickets**: View tickets assigned specifically to them
- **Respond to Tickets**: Reply to customer tickets
- **Status Updates**: Change ticket status as work progresses
- **Internal Collaboration**: Add internal notes for team communication

## System Architecture

### Backend Components

#### 1. Database Models

**SupportTicket** (`app/models/support.py`)
```python
- id: Unique identifier
- user_id: Customer who created the ticket
- ticket_number: Human-readable ticket ID (e.g., TICK-2025-0001)
- subject: Ticket subject line
- description: Initial detailed description
- status: open | in_progress | closed
- priority: low | medium | high | urgent
- department: technical | billing | sales | general
- assigned_to: Support employee ID (nullable)
- created_at, updated_at, closed_at: Timestamps
```

**TicketMessage** (`app/models/ticket_message.py`)
```python
- id: Unique identifier
- ticket_id: Reference to parent ticket
- user_id: Author of the message
- message: Message content
- is_internal_note: True if only visible to staff
- is_staff_reply: True if from admin/support employee
- created_at, updated_at: Timestamps
```

#### 2. API Endpoints

**User Endpoints** (`/api/v1/support/`)
- `GET /tickets` - Get user's tickets with optional status filter
- `GET /tickets/{id}` - Get ticket details with messages
- `POST /tickets` - Create new ticket
- `POST /tickets/{id}/messages` - Add reply to ticket
- `PUT /tickets/{id}/status` - Update status (users can only close)

**Admin Endpoints** (`/api/v1/support/admin/`)
- `GET /tickets` - Get all tickets with filters (status, priority, assigned_to, department)
- `GET /my-assigned-tickets` - Get tickets assigned to current admin/support user
- `PUT /tickets/{id}/assign` - Assign ticket to employee
- `PUT /tickets/{id}/unassign` - Remove assignment
- `PUT /tickets/{id}` - Update ticket fields
- `GET /employees` - Get list of support staff
- `GET /stats` - Get support statistics

**Utility Endpoints**
- `GET /departments` - Get available departments
- `GET /priorities` - Get priority levels
- `GET /statuses` - Get ticket statuses

#### 3. Service Layer (`app/services/support_service_enhanced.py`)

Key Methods:
- `get_user_tickets()` - Fetch tickets for specific user
- `get_all_tickets()` - Fetch all tickets with filters (admin)
- `get_assigned_tickets()` - Fetch tickets for specific employee
- `create_ticket()` - Create new ticket with auto-generated number
- `assign_ticket()` - Assign to employee & set status to in_progress
- `update_ticket_status()` - Change status with timestamp handling
- `add_message()` - Add reply/note to ticket
- `get_ticket_messages()` - Fetch conversation thread
- `get_support_employees()` - List assignable staff with workload
- `get_support_stats()` - Generate dashboard statistics

### Frontend Components

#### 1. User Interface

**SupportEnhanced.tsx** (`src/pages/dashboard/SupportEnhanced.tsx`)

Views:
- **Tickets List**: Grid view of all user tickets with status badges
- **Ticket Detail**: Full conversation view with reply functionality
- **New Ticket Form**: Creation form with priority/department selection

Features:
- Status filter tabs (All/Open/In Progress/Closed)
- Real-time search
- Color-coded status and priority badges
- Message threading with staff reply indicators
- Close ticket button
- Reply textarea with send button

#### 2. Admin Interface

**SupportManagementEnhanced.tsx** (`src/pages/admin/SupportManagementEnhanced.tsx`)

Views:
- **Ticket List**: All tickets with advanced filters
- **Ticket Detail**: Full management interface

Features:
- Multi-dimensional filtering (status, priority, assigned employee, department)
- Employee assignment dropdown with workload display
- Status change dropdown
- Internal note toggle
- Staff reply composer
- Customer info display
- Priority/status badges
- Real-time message threading

## User Roles & Permissions

### Customer (role: 'customer')
- Create tickets
- View own tickets
- Reply to own tickets
- Close own tickets
- **Cannot**: Assign tickets, see internal notes, change priority/department

### Support Staff (role: 'support')
- View assigned tickets
- Reply to any ticket
- Add internal notes
- Update ticket status
- **Cannot**: Assign tickets to others (admin only)

### Admin (role: 'admin' | 'super_admin')
- Full access to all features
- View all tickets
- Assign tickets to support staff
- Update all ticket fields
- Add/view internal notes
- Manage support employees

## Ticket Lifecycle

```
┌─────────┐
│  OPEN   │ ← User creates ticket
└────┬────┘
     │
     │ Admin assigns to employee
     ↓
┌─────────────┐
│ IN PROGRESS │ ← Employee working on issue
└──────┬──────┘
       │
       │ Issue resolved
       ↓
  ┌─────────┐
  │ CLOSED  │
  └─────────┘
```

## Status Management Rules

1. **New Ticket**: Always created as `open`
2. **Assignment**: Automatically changes `open` → `in_progress`
3. **Unassignment**: If `in_progress` and unassigned → `open`
4. **Closing**: Sets `closed_at` timestamp
5. **Reopening**: Clears `closed_at` timestamp

## Ticket Numbering

Format: `TICK-{YEAR}-{SEQUENCE}`

Example: `TICK-2025-0001`, `TICK-2025-0002`, etc.

Auto-increments per year, resets each new year.

## Message Types

### 1. Customer Messages
- Visible to everyone
- From ticket creator
- Light background

### 2. Staff Replies
- Visible to everyone
- From admin/support staff
- Purple/pink gradient background
- "STAFF" badge

### 3. Internal Notes
- Only visible to admin/support staff
- Orange background
- "INTERNAL NOTE" badge
- For team collaboration

## Setup Instructions

### Backend Setup

1. **Run Database Migration**
```bash
cd backend_template
alembic upgrade head
```

2. **Update API Router** (if not done)

In `app/api/v1/api.py`, replace old support import:
```python
# Replace this:
from app.api.v1.endpoints import support

# With this:
from app.api.v1.endpoints import support_enhanced as support
```

3. **Update Service Import** (if needed)

In `app/api/v1/endpoints/support_enhanced.py`, the service is already imported correctly.

4. **Restart Backend**
```bash
./venv/bin/uvicorn app.main:app --reload
```

### Frontend Setup

1. **Update Routes**

In your routing file, replace old Support component:
```typescript
// Replace:
import { Support } from './pages/dashboard/Support';

// With:
import { SupportEnhanced as Support } from './pages/dashboard/SupportEnhanced';
```

For admin routes:
```typescript
import { SupportManagementEnhanced as SupportManagement } from './pages/admin/SupportManagementEnhanced';
```

2. **Update API Client** (already done in `src/lib/api.ts`)

Endpoints updated to use `/api/v1/support/tickets/*` paths.

3. **Restart Frontend**
```bash
npm run dev
```

## Testing Checklist

### User Flow
- [ ] Create new ticket with different priorities/departments
- [ ] View ticket list with status filters
- [ ] Open ticket detail and view messages
- [ ] Reply to ticket
- [ ] Close ticket
- [ ] Search tickets

### Admin Flow
- [ ] View all tickets
- [ ] Filter by status/priority/employee/department
- [ ] Assign ticket to employee
- [ ] Reply to ticket as staff
- [ ] Add internal note
- [ ] Change ticket status
- [ ] View employee workload

### Support Staff Flow
- [ ] View assigned tickets
- [ ] Reply to assigned ticket
- [ ] Update ticket status
- [ ] Add internal notes

## Database Schema

### support_tickets
```sql
CREATE TABLE support_tickets (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users_profiles(id),
    ticket_number VARCHAR(100) UNIQUE NOT NULL,
    subject VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'open',
    priority VARCHAR(50) DEFAULT 'medium',
    department VARCHAR(100) DEFAULT 'technical',
    assigned_to INTEGER REFERENCES users_profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE,
    closed_at TIMESTAMP WITH TIME ZONE
);
```

### ticket_messages
```sql
CREATE TABLE ticket_messages (
    id SERIAL PRIMARY KEY,
    ticket_id INTEGER NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users_profiles(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    is_internal_note BOOLEAN DEFAULT FALSE,
    is_staff_reply BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);
```

## Best Practices

### For Support Staff
1. Always assign tickets to yourself when starting work
2. Update status to "in_progress" when working
3. Use internal notes for team communication
4. Set priority appropriately based on urgency
5. Close tickets only when fully resolved

### For Admins
1. Balance workload when assigning tickets
2. Review unassigned tickets regularly
3. Use priority system consistently
4. Monitor response times
5. Archive old closed tickets periodically

### For Developers
1. Always use enhanced service methods
2. Check permissions before operations
3. Log important actions
4. Handle errors gracefully
5. Keep message threading performant

## Troubleshooting

### Tickets not loading
- Check backend is running on port 8000
- Verify authentication token in localStorage
- Check browser console for API errors

### Can't assign tickets
- Verify user has admin role
- Check employee exists in database
- Ensure ticket ID is valid

### Messages not appearing
- Verify ticket_messages table exists
- Check foreign key relationships
- Ensure is_internal_note filter is correct

### Status not updating
- Check user permissions
- Verify valid status values
- Check database constraints

## Future Enhancements

### Planned Features
- Email notifications on ticket updates
- File attachments
- Ticket templates
- SLA tracking
- Performance metrics dashboard
- Auto-assignment based on workload
- Ticket escalation rules
- Customer satisfaction ratings
- Knowledge base integration

### Performance Optimizations
- Pagination for large ticket lists
- Message loading on scroll
- Caching frequently accessed data
- Database query optimization
- Real-time WebSocket updates

## Support

For questions or issues with the ticketing system:
1. Check this documentation
2. Review API endpoint documentation
3. Check backend logs for errors
4. Contact development team

---

**System Version**: 1.0.0  
**Last Updated**: January 2025  
**Status**: Production Ready ✅
