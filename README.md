PM Dashboard – Micrologic

A secure Project Management Dashboard for Micrologic, built with a Node.js (Express) backend and a React (Vite) frontend.
The system supports role-based access (Admin, Tech Sales, Customer), document management, audit logging, and email notifications.

Project Structure
pm_dashboard_micrologic/
├── backend/ # Node.js + Express API
├── frontend/ # React (Vite) application
├── backend/ # Node.js + Express API
├── frontend/ # React (Vite) application
├── .gitignore
└── README.md
Tech Stack

Backend
HEAD

7f3b888 (updated frontend and backend v8)

- Node.js
- Express.js
- PostgreSQL
- JWT Authentication
- Multer (file uploads)
- Microsoft Graph (email notifications)
- Socket.IO

Frontend

- React
- Vite
- Tailwind CSS
- Axios
- React Router

Prerequisites

7f3b888 (updated frontend and backend v8)

- Node.js 18+
- npm
- PostgreSQL
- Git

Setup Instructions

Clone the repository
git clone https://github.com/aniruddharao1973-pixel/pm_dashboard_micrologic.git
cd pm_dashboard_micrologic

Backend Setup
cd backend
npm install
npm run dev

Frontend Setup
cd frontend
npm install
npm run dev

Environment Variables

Environment files are required and are not committed.

Backend (backend/.env)

7f3b888 (updated frontend and backend v8)

- PORT
- DATABASE_URL
- JWT_SECRET
- MS_CLIENT_ID
- MS_CLIENT_SECRET
- MS_TENANT_ID
- MAIL_FROM

Frontend (frontend/.env)

- VITE_API_BASE_URL

Notes

- VITE_API_BASE_URL

Notes

7f3b888 (updated frontend and backend v8)

- node_modules are excluded from Git
- Run npm install after cloning
- Do not commit .env files
- Uploaded files are stored in backend/uploads

Security

7f3b888 (updated frontend and backend v8)

- Role-based access control
- Resource-level authorization
- URL tampering protection
- Audit logging with IP tracking
- Secure email delivery via Microsoft Graph

License
Proprietary – Internal Micrologic use only

Maintainer
Micrologic – Project Management Team

Final Action
git add README.md
git commit -m "Finalize README"
git push origin main
