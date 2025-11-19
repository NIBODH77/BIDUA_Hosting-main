# BIDUA Hosting Platform

A complete hosting management platform with React frontend (PWA) and FastAPI backend.

![BIDUA Hosting](https://img.shields.io/badge/Version-1.0.0-blue.svg)
![React](https://img.shields.io/badge/React-18.x-61DAFB.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104.1-009688.svg)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-18.1-336791.svg)

## 🚀 Features

- **Mobile-First PWA**: Installable progressive web app with offline support
- **User Dashboard**: Manage servers, billing, invoices, and support tickets
- **Admin Panel**: Complete platform management with user, server, and order management
- **Referral System**: Built-in affiliate program with commission tracking
- **Payment Integration**: Razorpay payment gateway integration
- **Real-time Updates**: Live server status and notifications
- **Responsive Design**: Optimized for mobile, tablet, and desktop

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.x or higher)
- **Python** (v3.11 or higher)
- **PostgreSQL** (v14.x or higher)
- **Git**

## 🛠️ Installation Guide

### 1. Clone the Repository

```bash
git clone https://github.com/obidua/BIDUA_Hosting.git
cd BIDUA_Hosting
```

### 2. Backend Setup (FastAPI)

#### Step 1: Navigate to Backend Directory

```bash
cd backend_template
```

#### Step 2: Create Virtual Environment

```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

#### Step 3: Install Dependencies

```bash
pip install -r requirements.txt
```

#### Step 4: Configure Environment Variables

Create a `.env` file in the `backend_template` directory:

```bash
# Database Configuration
DATABASE_URL=postgresql+asyncpg://postgres:your_password@localhost:5432/ramaera_hosting

# JWT Secret (Generate a secure random string)
SECRET_KEY=your-super-secret-jwt-key-change-this-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS Origins (Update for production)
BACKEND_CORS_ORIGINS=["http://localhost:4334","http://localhost:3000"]

# Razorpay Configuration (Get from https://razorpay.com)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Email Configuration (Optional - for notifications)
# Replace with your actual SMTP server details
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=noreply@yourdomain.com
SMTP_PASSWORD=your_smtp_app_password_here

# Environment
ENVIRONMENT=development
```

#### Step 5: Create PostgreSQL Database

```bash
# Login to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE ramaera_hosting;

# Exit PostgreSQL
\q
```

#### Step 6: Run Database Migrations

```bash
# Initialize Alembic (if not already done)
alembic upgrade head
```

#### Step 7: Seed Database with Test Data

```bash
python setup_database.py
```

This creates two test users:
- **Admin**: admin1234@test.com / Password: 1234
- **User**: user1234@test.com / Password: 1234

#### Step 8: Start Backend Server

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Backend will be available at: `http://localhost:8000`
API Documentation: `http://localhost:8000/docs`

### 3. Frontend Setup (React)

#### Step 1: Navigate to Frontend Directory

Open a new terminal window:

```bash
cd BIDUA_Hosting-main
```

#### Step 2: Install Dependencies

```bash
npm install
```

#### Step 3: Configure Environment Variables

Create a `.env` file in the `BIDUA_Hosting-main` directory:

```bash
VITE_API_URL=http://localhost:8000/api/v1
VITE_APP_NAME=BIDUA Hosting
```

#### Step 4: Start Development Server

```bash
npm run dev
```

Frontend will be available at: `http://localhost:4334`

## 🌐 Production Deployment

### Backend Deployment (Ubuntu Server)

#### 1. Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install dependencies
sudo apt install python3-pip python3-venv postgresql nginx -y
```

#### 2. Clone Repository

```bash
cd /var/www
sudo git clone https://github.com/obidua/BIDUA_Hosting.git
sudo chown -R $USER:$USER BIDUA_Hosting
cd BIDUA_Hosting/backend_template
```

#### 3. Setup Python Environment

```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

#### 4. Configure Production Environment

Create `.env` file with production settings:

```bash
DATABASE_URL=postgresql+asyncpg://postgres:secure_password@localhost:5432/ramaera_hosting
SECRET_KEY=generate-a-very-long-random-string-for-production
ENVIRONMENT=production
BACKEND_CORS_ORIGINS=["https://yourdomain.com","https://www.yourdomain.com"]
```

#### 5. Setup PostgreSQL

```bash
sudo -u postgres psql
CREATE DATABASE ramaera_hosting;
CREATE USER bidua_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE ramaera_hosting TO bidua_user;
\q

# Run migrations
alembic upgrade head
python setup_database.py
```

#### 6. Setup Gunicorn Service

Create `/etc/systemd/system/bidua-backend.service`:

```ini
[Unit]
Description=BIDUA Hosting Backend
After=network.target

[Service]
User=www-data
Group=www-data
WorkingDirectory=/var/www/BIDUA_Hosting/backend_template
Environment="PATH=/var/www/BIDUA_Hosting/backend_template/venv/bin"
ExecStart=/var/www/BIDUA_Hosting/backend_template/venv/bin/gunicorn -w 4 -k uvicorn.workers.UvicornWorker app.main:app --bind 127.0.0.1:8000

[Install]
WantedBy=multi-user.target
```

Start the service:

```bash
sudo systemctl daemon-reload
sudo systemctl start bidua-backend
sudo systemctl enable bidua-backend
```

#### 7. Configure Nginx

Create `/etc/nginx/sites-available/bidua-backend`:

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/bidua-backend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 8. Setup SSL (Let's Encrypt)

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d api.yourdomain.com
```

### Frontend Deployment

#### Option 1: Vercel (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import the repository
4. Set root directory to `BIDUA_Hosting-main`
5. Add environment variables:
   - `VITE_API_URL=https://api.yourdomain.com/api/v1`
6. Deploy

#### Option 2: Nginx Static Hosting

```bash
cd /var/www/BIDUA_Hosting/BIDUA_Hosting-main

# Build for production
npm install
npm run build

# Configure Nginx
sudo nano /etc/nginx/sites-available/bidua-frontend
```

Add configuration:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    root /var/www/BIDUA_Hosting/BIDUA_Hosting-main/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

Enable and restart:

```bash
sudo ln -s /etc/nginx/sites-available/bidua-frontend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

#### Option 3: Docker Deployment

Create `docker-compose.yml` in the root directory:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:18
    environment:
      POSTGRES_DB: ramaera_hosting
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: your_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  backend:
    build: ./backend_template
    ports:
      - "8000:8000"
    environment:
      DATABASE_URL: postgresql+asyncpg://postgres:your_password@postgres:5432/ramaera_hosting
      SECRET_KEY: your-secret-key
    depends_on:
      - postgres

  frontend:
    build: ./BIDUA_Hosting-main
    ports:
      - "4334:80"
    environment:
      VITE_API_URL: http://localhost:8000/api/v1

volumes:
  postgres_data:
```

Deploy:

```bash
docker-compose up -d
```

## 📱 PWA Installation

The app can be installed on mobile devices:

- **Android**: Automatic install prompt after 30 seconds
- **iOS**: Tap Share → Add to Home Screen

## 🔧 Configuration

### Backend Configuration

Edit `backend_template/app/core/config.py` for:
- Database settings
- CORS origins
- JWT expiration
- Payment gateway keys

### Frontend Configuration

Edit `BIDUA_Hosting-main/vite.config.ts` for:
- Build settings
- PWA configuration
- Port settings

## 📊 Database Schema

The platform uses 14 main tables:
- `users_profiles` - User accounts
- `servers` - Server instances
- `hosting_plans` - Hosting plan templates
- `orders` - Customer orders
- `invoices` - Billing invoices
- `payment_transactions` - Payment records
- `payment_methods` - Saved payment methods
- `billing_settings` - Global billing config
- `support_tickets` - Customer support
- `referral_commission_rates` - Commission tiers
- `referral_earnings` - Affiliate earnings
- `referral_payouts` - Payout requests
- `user_settings` - User preferences
- `alembic_version` - Migration tracking

## 🔐 Security

- JWT-based authentication
- Password hashing with bcrypt
- CORS protection
- SQL injection prevention via SQLAlchemy ORM
- XSS protection
- HTTPS enforced in production

### 🔒 Security Best Practices

**IMPORTANT**: Never commit sensitive credentials to Git repositories!

1. **Environment Variables**: Always use `.env` files for sensitive data
2. **Add to .gitignore**: Ensure `.env` files are in `.gitignore`
3. **Use .env.example**: Provide example files with placeholder values
4. **Rotate Secrets**: Regularly update passwords, API keys, and tokens
5. **Strong Passwords**: Use complex passwords (min 16 characters)
6. **Secret Generation**: Use tools like `openssl rand -hex 32` for secure keys

If you accidentally commit secrets:
- Immediately revoke/rotate the exposed credentials
- Use `git filter-branch` or BFG Repo-Cleaner to remove from history
- Force push the cleaned repository
- Update all instances using the old credentials

## 🧪 Testing

```bash
# Backend tests
cd backend_template
pytest

# Frontend tests
cd BIDUA_Hosting-main
npm test
```

## 📝 API Documentation

Once the backend is running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📧 Support

For support, email support@biduahosting.com or open an issue on GitHub.

## 📄 License

This project is proprietary software. All rights reserved.

## 👥 Authors

- **BIDUA Industries** - *Initial work*

## 🙏 Acknowledgments

- React Team for the amazing framework
- FastAPI for the blazing-fast backend framework
- PostgreSQL for reliable database
- Tailwind CSS for beautiful styling

---

**Built with ❤️ by BIDUA Industries**
