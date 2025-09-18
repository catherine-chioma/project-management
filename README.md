📖 Description

This is the backend for a Project Management application. It provides RESTful APIs for managing projects, documents, tasks, and payments.
The backend is built with Node.js (Express), PostgreSQL, and Prisma ORM, ensuring a clean and scalable structure.

🚀 Tech Stack

Node.js + Express.js

TypeScript

PostgreSQL

Prisma ORM

Git & GitHub (for version control)

⚙️ Setup & Installation

1. Clone the Repository
   git clone https://github.com/catherine-chioma/project-management.git
   cd project-management/backend

2. Install Dependencies
   npm install

3. Configure Environment Variables

Create a .env file in the backend directory and add:

DATABASE_URL="postgresql://<username>:<password>@localhost:5432/project_management_db?schema=public"

4. Run Prisma Migrations
   npx prisma migrate dev --name init

5. Start the Development Server
   npm run dev

📂 Project Structure
backend/
├── prisma/
│ ├── schema.prisma # Database schema
│ └── migrations/ # Migration files
├── src/
│ ├── server.ts # Express server setup
│ ├── routes/ # API routes
│ ├── controllers/ # Request handlers
│ └── services/ # Business logic
├── .env # Environment variables (not pushed to Git)
├── .gitignore
├── package.json
└── README.md

📌 Features

🔹 CRUD operations for Projects

🔹 Document storage & retrieval

🔹 Payment management

🔹 PostgreSQL persistence via Prisma

🔹 Scalable REST API design

📡 API Endpoints (Planned)

POST /api/projects → Create project

GET /api/projects → Get all projects

GET /api/projects/:id → Get project by ID

PUT /api/projects/:id → Update project

DELETE /api/projects/:id → Delete project

(Similar endpoints for documents, payments, tasks)

🤝 Contributing

Use incremental commits with clear messages:

git add .
git commit -m "feat: add project CRUD endpoints"
git push

Follow best practices for code structure and documentation.

📝 License

This project is for learning and demonstration purposes.
