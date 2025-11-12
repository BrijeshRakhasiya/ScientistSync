# ScientistSync

ScientistSync is a full-stack web application designed to connect scientists, facilitate research sharing, and foster collaboration. The project is divided into a backend (Node.js/Express/MongoDB) and a frontend (React).

## Features

- User authentication (signup, login, profile)
- Upload and share research papers
- Comment on research
- View and interact with other scientists' profiles
- Responsive and modern UI

### Admin Panel (New)
- Protected admin endpoints with a shared secret
- View platform stats (users, research, comments)
- Manage users (promote/demote admin, verify/unverify)
- Moderate research (soft delete/restore)
- Moderate comments (soft delete)

---

## Project Structure

```
ScientistSync/
├── backend/
│   ├── config/           # Database configuration
│   ├── models/           # Mongoose models (User, Research, Comment)
│   ├── routes/           # Express routes (API endpoints)
│   ├── views/            # EJS views (if any server-side rendering)
│   ├── seed.js           # Database seeding script
│   ├── server.js         # Main Express server
│   └── package.json      # Backend dependencies
├── frontend/
│   ├── public/           # Static public assets
│   ├── src/              # React source code
│   │   ├── components/   # Reusable React components
│   │   ├── pages/        # Page-level React components
│   │   ├── services/     # API service layer
│   │   ├── App.jsx       # Main App component
│   │   └── index.js      # Entry point
│   ├── build/            # Production build output
│   └── package.json      # Frontend dependencies
└── LICENSE
```

---

## Getting Started

### Prerequisites
- Node.js (v14+ recommended)
- npm or yarn
- MongoDB (local or cloud)

### Backend Setup
1. Navigate to the backend folder:
   ```sh
   cd backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Configure MongoDB connection in `config/db.js`.
4. (Optional) Seed the database:
   ```sh
   node seed.js
   ```
5. Configure Admin Secret (required for admin endpoints):
   Create or edit `.env` in `backend/` and add:
   ```env
   ADMIN_SECRET=your-strong-admin-secret
   ```
6. Start the backend server:
   ```sh
   npm start
   ```
   The server will run on `http://localhost:5000` by default.

### Frontend Setup
1. Navigate to the frontend folder:
   ```sh
   cd frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the React development server:
   ```sh
   npm start
   ```
   The app will run on `http://localhost:3000` by default.

---

## API Endpoints (Backend)
- `/api/auth/signup` - User signup
- `/api/auth/login` - User login
- `/api/research` - Upload, fetch, and manage research papers
- `/api/comments` - Comment on research
- `/api/admin/*` (Protected with `X-Admin-Secret: <ADMIN_SECRET>` header):
   - `GET /api/admin/stats`
   - `GET /api/admin/users`
   - `PATCH /api/admin/users/:id/role` body: `{ role: 'user' | 'admin' }`
   - `PATCH /api/admin/users/:id/verify` body: `{ isVerified: boolean }`
   - `GET /api/admin/research?includeDeleted=true`
   - `DELETE /api/admin/research/:id` (soft delete)
   - `PATCH /api/admin/research/:id/restore`
   - `GET /api/admin/comments[?researchId=...]`
   - `DELETE /api/admin/comments/:id` (soft delete)

---

## Technologies Used
- **Backend:** Node.js, Express, MongoDB, Mongoose
- **Frontend:** React, CSS
- **Other:** EJS (for server-side views)

---

## Using the Admin Panel (Frontend)
1. Ensure the backend has `ADMIN_SECRET` set and is running.
2. From the UI, log in. If your account has role `admin`, you will see an Admin link in the navbar. Alternatively, navigate to `/admin` and enter the Admin Secret once to unlock in this session.
3. Use the tabs to view stats, manage users, research, and comments.

Note: This project uses a shared-secret header for admin in lieu of a full JWT/session auth system. For production, integrate proper auth and server-side session/JWT validation.

---

## License
This project is licensed under the MIT License.
