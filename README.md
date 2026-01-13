HUDRA 🚀 Location-based Task Marketplace
Technical Lead (Fixed-term Contract): Ankit R V
📧 ankith8804@gmail.com
Duration: 3 months (Jan 14 - Apr 14, 2026) | 15-20h/week | 30% Equity
🎓 NITK'27 | Production MVP Delivery: Apr 14, 2026

📋 Product Overview (From Product Specification)
HUDRA connects people needing real-world tasks with local taskers. Platform controls discovery, communication, payments, status tracking, and trust mechanisms. Revenue model: Commission on completed tasks.
​

Core Product Principles:

"Trust over speed" – Users trust platform with money/work
​
"Structure without friction" – Guided flows, minimal inputs
​
"Platform-controlled payments" – No off-platform payments
​

Supported Task Categories: Moving, Cleaning, Pet Care, Event Help, Handyman, Errands, Gardening, Delivery, Basic Tech Setup
​

🎯 Contract Deliverables (13 Weeks, 195 Hours Total)
Phase 1: Engineering Foundation (Week 1-3, 52h)

☐ Professional monorepo + GitHub Actions CI/CD
☐ Task CRUD APIs + PostgreSQL database schema
☐ Task creation flow (free-text → smart guidance → location/budget)
☐ Production deployment (Render: Web + Postgres + Redis)
☐ API Documentation (DRF Spectacular: /docs endpoint)
Phase 2: Marketplace Core (Week 4-6, 52h)

☐ Task discovery: Geo-filtering + category relevance scoring
☐ Tasker applications: Proposal + fixed price + completion time
☐ Lister appointment workflow: Review applicants → Appoint single tasker
☐ Status lifecycle: Open→Appointed→InProgress→Completed→Paid
☐ Google Maps API integration (location picker + radius search)
Phase 3: Payments & Communication (Week 7-9, 52h)

☐ Razorpay integration: Escrow flow (Pay→Hold→Release on completion)
☐ Django Channels: In-app chat (appointment-gated, PII regex blocking)
☐ Wallet system: Earnings → 15% commission → Available balance
☐ Celery+Redis: Email/SMS notifications + withdrawal processing queue
Phase 4: Production Systems (Week 10-12, 30h)

☐ JWT Authentication + Twilio Phone OTP (2FA before payments)
☐ Role-based dashboards (Lister: active tasks | Tasker: wallet/applications)
☐ Sentry error monitoring + Django rate limiting
☐ Dispute reporting + Django Admin panel
☐ UPI/Bank withdrawal processing
Phase 5: Production Delivery (Week 13, 9h)

☐ Beta testing (target: 25 completed real tasks)
☐ Load testing + Performance optimization (<500ms P95)
☐ Production documentation + Admin training materials
☐ Code handover + Deployment runbooks
🏗️ Production Architecture


BACKEND API: Django REST Framework 4.2.10 + PostgreSQL 15
├── Authentication: JWT + Twilio Phone OTP
├── Core Models: UserProfile, Task, Application, ChatMessage, WalletTransaction
├── Payments: Razorpay Webhooks (escrow implementation)
├── Real-time: Django Channels 4.1 + Redis 7 (chat)
├── Background: Celery 5.3.6 + Redis (notifications, payouts)
└── Database: PostgreSQL 15 (Render managed instance)

FRONTEND: Next.js 14.1 + Tailwind CSS 3.4.10 + HTMX
├── Task posting: Multi-step guided form with live validation
├── Location: Google Maps Places API (autocomplete + map picker)
├── Dashboards: PC-optimized responsive layouts
└── Chat: Real-time UI (appointment-gated access)

INFRASTRUCTURE:
├── Deploy: Render (Web Service + PostgreSQL + Redis)
├── Monitoring: Sentry (production error tracking)
├── CI/CD: GitHub Actions (linting + test automation)
└── API Docs: DRF Spectacular (OpenAPI /docs endpoint)
📊 Project Progress Dashboard
Phase	Weeks	Planned Hours	Actual Hours	Status	Key Deliverables
Phase 1	1-3	52h	0h	🟡 Initializing	0/5
Phase 2	4-6	52h	0h	⬜ Planned	0/5
Phase 3	7-9	52h	0h	⬜ Planned	0/5
Phase 4	10-12	30h	0h	⬜ Planned	0/5
Phase 5	13	9h	0h	⬜ Planned	0/5
Total Budget: 195 hours | Weekly Burn: 15h average

🚀 Production Quickstart
Backend Development Environment
bash
git clone https://github.com/ankit-rv-08/HUDRA.git
cd HUDRA/backend
python -m venv venv
source venv/bin/activate  # Linux/Mac
pip install -r requirements.txt
cp .env.example .env
# Edit .env: SECRET_KEY, DATABASE_URL, RAZORPAY_KEY_ID, etc.
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
Production APIs:

Task Docs: http://localhost:8000/docs

Admin Panel: http://localhost:8000/admin

Frontend Development (Phase 2+)
bash
cd frontend
npm ci
npm run dev
📈 Production Success Criteria
text
TECHNICAL KPIs (Week 13):
• API Uptime: 99.9% (Render dashboard metrics)
• Response Time: <500ms (P95 across all endpoints)
• Payment Success: 100% (25 beta transactions)

BUSINESS KPIs (Beta Testing):
• 50 registered users (listers + taskers)
• 25 completed paid tasks
• ₹15,000 total transaction volume
• Platform commission: ₹2,250 (15% take rate)

SECURITY REQUIREMENTS:
• Phone OTP verification before payments/withdrawals
• Chat PII blocking (phone/email/social regex)
• Rate limiting: 100 requests/minute per IP
📁 Production File Structure
text
HUDRA/                           # Production Monorepo
├── backend/                    # Django DRF API (100+ endpoints)
│   ├── core/                  # Base models + Serializers
│   ├── tasks/                 # Task CRUD + Business logic
│   ├── payments/              # Razorpay + Wallet transactions
│   ├── users/                 # Profiles + Authentication
│   └── chat/                  # Django Channels real-time
├── frontend/                  # Next.js 14 + Tailwind + HTMX
├── docs/                      # Wireframes + API specifications
├── deploy/                    # Render blueprints + Docker
├── scripts/                   # Database migrations + seeds
├── .github/workflows/         # GitHub Actions CI/CD
├── requirements.txt           # Python dependencies
├── package.json               # Frontend dependencies
├── .env.example              # Environment configuration
└── README.md                 # This document
👨‍💼 Technical Lead Contact

Ankit R V
Technical Lead - HUDRA (Fixed-term Contract)
📧 ankith8804@gmail.com
🌐 github.com/ankit-rv-08/HUDRA
💼 linkedin.com/in/ankit-rv-08
🎓 NITK Electrical Engineering '27
☁️ AWS Solutions Architect + Azure Administrator Certified

Production marketplace development: Design → Architecture → Implementation → Deployment → Scale
📄 Legal & Licensing
MIT License © 2026 HUDRA Limited. All rights reserved.
