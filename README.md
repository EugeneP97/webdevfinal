# Online Course Service

Final exam implementation: a full-stack Online Course Service with Next.js backend, React frontend, and MongoDB.

## Student Information

- **Student Name:** (fill in)
- **Student ID:** (fill in)

## Test Credentials

| Role    | Username  | Email                  | Password    |
| ------- | --------- | ---------------------- | ----------- |
| Teacher | teacher1  | teacher1@example.com   | teacher123  |
| Teacher | teacher2  | teacher2@example.com   | teacher123  |
| Teacher | teacher3  | teacher3@example.com   | teacher123  |
| Student | student1  | student1@example.com   | student123  |
| Student | student2  | student2@example.com   | student123  |
| Student | student3  | student3@example.com   | student123  |

## Prerequisites

- Node.js 18+
- MongoDB instance (local or MongoDB Atlas)
- npm

## How to Run & Test

### 1. Backend Setup (`next-backend/`)

```bash
cd next-backend
cp .env.example .env.local
# Edit .env.local and set MONGODB_URI and JWT_SECRET
npm install
npm run seed
npm run dev
```

Backend runs on `http://localhost:3000`.

### 2. Frontend Setup (`react-frontend/`)

```bash
cd react-frontend
cp .env.example .env.local
# For local development VITE_API_URL can be /api (Vite proxies to localhost:3000)
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`.

### 3. Testing Walkthrough

1. Open `http://localhost:5173`.
2. Login as a Teacher (`teacher1@example.com` / `teacher123`).
   - Create a course.
   - View the course details and see enrolled students.
   - Update the course.
   - Try to delete a course that has enrolled students (should fail).
3. Login as a Student (`student1@example.com` / `student123`).
   - Browse courses (Cancelled courses are hidden).
   - Search courses by name or teacher name.
   - Enroll in an Open course with available seats.
   - Try to enroll again in the same course (should fail).
   - View "My Enrolled Courses".
4. Verify backend rejects unauthenticated or cross-role requests.

## Environment Variables

### Backend (`next-backend/.env.local`)

- `MONGODB_URI` — MongoDB connection string
- `MONGODB_DB` — Database name (default: `wad_final`)
- `JWT_SECRET` — Secret for signing JWT tokens
- `CORS_ORIGIN` — Frontend origin for CORS (default: `http://localhost:5173`)

### Frontend (`react-frontend/.env.local`)

- `VITE_API_URL` — Backend API base URL (default: `http://localhost:3000/api`)
  - For local development with Vite proxy, set to `/api`.

## Deployment

- Deploy `next-backend/` to Vercel (or another Node.js host).
- Deploy `react-frontend/` to Vercel.
- Set the environment variables on each platform.
- Ensure the deployed frontend URL is allowed in the backend `CORS_ORIGIN`.

## Project Structure

- `next-backend/src/app/api/` — Backend API routes
- `next-backend/src/lib/` — Shared helpers (auth, db, utils, cors)
- `next-backend/scripts/seed.mjs` — Seed test users
- `react-frontend/src/pages/` — Frontend pages
- `react-frontend/src/services/api.js` — API client
- `react-frontend/src/context/UserContext.jsx` — Authentication context
