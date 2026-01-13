<div align="center">
  <img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&pause=1000&color=7F9CF5&center=true&vCenter=true&width=435&lines=HUDRA:+Location-based+Task+Marketplace;Technical+Lead:+Ankit+R+V;Production+MVP+Apr+14%2C+2026" alt="Typing SVG" />
</div>

<div align="center">

**Technical Lead (Fixed-term Contract)**  
**Ankit R V** 🐍  
**📧** [ankith8804@gmail.com](mailto:ankith8804@gmail.com)  
**⏰** Jan 14 - Apr 14, 2026 | **15-20h/week** | **30% Equity**  
**🎓** NITK '27  

[![Django](https://img.shields.io/badge/Django-4.2-092E20?style=for-the-badge&logo=django&logoColor=white)](https://www.djangoproject.com/)
[![Next.js](https://img.shields.io/badge/Next.js-14-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Render](https://img.shields.io/badge/Render-Deploy-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://render.com/)

</div>

---

## 🎯 **Product Overview**

**HUDRA** is a **location-based task marketplace** connecting people needing real-world tasks with local taskers. The platform fully controls:

💼 Task Discovery & Matching
💬 Communication (in-app chat only)
💰 Payments (platform escrow)
📊 Status Tracking
🛡️ Trust & Accountability

**Revenue Model**: Commission on completed tasks[file:1]

### **Supported Categories**

🏠 Moving & Cleaning
🐕 Pet Care & Event Help
🔧 Handyman & Errands
🌱 Gardening & Delivery
💻 Basic Tech Setup
​

text

---

## 📋 **Contract Scope** 
### *13 Weeks • 195 Hours • Production MVP*

| Phase | Weeks | Hours | Status | Deliverables |
|-------|-------|-------|--------|--------------|
| **1️⃣ Foundation** | **1-3** | **52h** | 🟡 **Active** | GitHub + Task CRUD + Deploy |
| 2️⃣ Marketplace | 4-6 | 52h | ⬜ | Applications + Location |
| 3️⃣ Payments | 7-9 | 52h | ⬜ | Razorpay + Chat + Wallet |
| 4️⃣ Production | 10-12 | 30h | ⬜ | Dashboards + Verification |
| **5️⃣ Delivery** | **13** | **9h** | ⬜ | Beta + Handover |

---

## 🏗️ **Production Stack**

```mermaid
graph TB
    A[Django REST API] --> B[PostgreSQL 15]
    A --> C[Razorpay Escrow]
    A --> D[Django Channels]
    D --> E[Redis 7]
    F[Next.js 14] --> G[Tailwind + HTMX]
    F --> H[Google Maps API]
    I[Render] --> J[Web Service]
    I --> B
    I --> E

🚀 Quickstart
Backend

git clone https://github.com/ankit-rv-08/HUDRA.git
cd HUDRA/backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python manage.py migrate
python manage.py runserver

🔗 APIs: http://localhost:8000/docs

Frontend (Phase 2+)
bash
cd frontend && npm ci && npm run dev

📈 Production KPIs
| Metric          | Target      | Status |
| --------------- | ----------- | ------ |
| API Uptime      | 99.9%       | 🟡     |
| P95 Response    | <500ms      | 🟡     |
| Beta Tasks      | 25 paid     | 🟡     |
| Transaction Vol | ₹15K        | 🟡     |
| Commission      | ₹2.2K (15%) | 🟡     |

📁 Repository Structure

📁 HUDRA/
├── 📁 backend/           # Django DRF API
│   ├── 📁 core/         # Models & Serializers
│   ├── 📁 tasks/        # Business Logic
│   ├── 📁 payments/     # Razorpay Integration
│   └── 📁 users/        # Auth & Profiles
├── 📁 frontend/         # Next.js App
├── 📁 docs/            # API Specifications
├── 📁 deploy/          # Render Blueprints
└── 🔄 .github/workflows/ # CI/CD

👨‍💼 Technical Lead
<div align="center">
text
Ankit R V
📧 ankith8804@gmail.com
💻 github.com/ankit-rv-08
💼 linkedin.com/in/ankit-rv-08
🏫 NITK Electrical '27
☁️ AWS Solutions Architect Certified

"End-to-end production SaaS development"
</div>
<div align="center">
📄 Legal
MIT License © 2026 HUDRA Limited
