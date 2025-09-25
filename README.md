# ScientistSync

ScientistSync is a full-stack web application designed to connect scientists, facilitate research sharing, and foster collaboration. The project is divided into a backend (Node.js/Express/MongoDB) and a frontend (React).

## Features

- User authentication (signup, login, profile)
- Upload and share research papers
- Comment on research
- View and interact with other scientists' profiles
- Responsive and modern UI

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
5. Start the backend server:
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
- `/api/users` - User registration, login, profile
- `/api/research` - Upload, fetch, and manage research papers
- `/api/comments` - Comment on research

---

## Technologies Used
- **Backend:** Node.js, Express, MongoDB, Mongoose
- **Frontend:** React, CSS
- **Other:** EJS (for server-side views), JWT (for authentication)

---

## License
This project is licensed under the MIT License.
