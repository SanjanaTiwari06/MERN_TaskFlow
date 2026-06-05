# TaskFlow – MERN Stack Task Manager

A full-stack Task Management Web Application built with MongoDB, Express.js, React.js, and Node.js.

## Features

- **User Auth** – Register, Login, JWT-based protected routes
- **Task CRUD** – Create, Read, Update, Delete tasks
- **Toggle Status** – Mark tasks as pending or completed
- **Search & Filter** – Search by keyword, filter by status/priority
- **Pagination** – Backend-powered pagination (10 per page)
- **Dashboard** – Stats: total, completed, pending, completion rate
- **Profile** – Update name/email, view task stats by priority
- **Form Validation** – Both frontend and backend validation

---

## Project Structure

```
mern-taskflow/
├── backend/
│   ├── config/
│   │   └── db.js               # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js   # register, login, getMe, updateProfile
│   │   └── taskController.js   # CRUD + toggle + stats
│   ├── middleware/
│   │   ├── authMiddleware.js   # JWT protect middleware
│   │   └── errorMiddleware.js  # Global error handler
│   ├── models/
│   │   ├── User.js             # User schema (name, email, password)
│   │   └── Task.js             # Task schema (title, desc, status, priority, userId)
│   ├── routes/
│   │   ├── authRoutes.js       # /api/auth/*
│   │   └── taskRoutes.js       # /api/tasks/*
│   ├── .env                    # Environment variables
│   ├── package.json
│   └── server.js               # Express app entry point
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── PrivateRoute.js  # Protected route wrapper
    │   │   ├── Sidebar.js       # Navigation sidebar
    │   │   └── TaskModal.js     # Add/Edit task modal
    │   ├── context/
    │   │   └── AuthContext.js   # Global auth state (Context API)
    │   ├── pages/
    │   │   ├── Login.js         # Login page
    │   │   ├── Register.js      # Register page
    │   │   ├── Dashboard.js     # Stats + recent tasks
    │   │   ├── Tasks.js         # All tasks + search/filter/pagination
    │   │   └── Profile.js       # Profile + task stats
    │   ├── utils/
    │   │   └── api.js           # Axios instance + all API calls
    │   ├── App.js               # React Router setup
    │   ├── index.js             # React entry point
    │   └── index.css            # Global styles
    └── package.json
```

---

## Setup & Run

### Prerequisites
- Node.js v18+
- MongoDB (local or [MongoDB Atlas](https://cloud.mongodb.com))
- npm or yarn

---

### 1. Clone & Install

```bash
# Clone repo
git clone https://github.com/yourusername/mern-taskflow.git
cd mern-taskflow

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

---

### 2. Configure Backend

Edit `backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/taskflow
# Or use Atlas: mongodb+srv://username:password@cluster.mongodb.net/taskflow
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=development
```

---

### 3. Run the App

```bash
# Terminal 1 – Start Backend
cd backend
npm run dev        # uses nodemon (auto-restart)
# OR
npm start

# Terminal 2 – Start Frontend
cd frontend
npm start
```

- Backend runs at: `http://localhost:5000`
- Frontend runs at: `http://localhost:3000`

---

## API Reference

### Auth Routes (`/api/auth`)

| Method | Endpoint         | Access  | Description           |
|--------|------------------|---------|-----------------------|
| POST   | /register        | Public  | Register new user     |
| POST   | /login           | Public  | Login & get JWT token |
| GET    | /me              | Private | Get current user      |
| PUT    | /update          | Private | Update profile        |

### Task Routes (`/api/tasks`) — All Protected

| Method | Endpoint          | Description                          |
|--------|-------------------|--------------------------------------|
| GET    | /                 | Get all tasks (search, filter, page) |
| GET    | /stats            | Get task statistics                  |
| GET    | /:id              | Get single task                      |
| POST   | /                 | Create new task                      |
| PUT    | /:id              | Update task                          |
| PATCH  | /:id/toggle       | Toggle pending ↔ completed           |
| DELETE | /:id              | Delete task                          |

### Query Params for GET /api/tasks
```
?search=keyword
&status=pending|completed
&priority=low|medium|high
&page=1
&limit=10
&sort=-createdAt
```

---

## Tech Stack

| Layer    | Technology                          |
|----------|-------------------------------------|
| Frontend | React.js 18, React Router v6, Axios |
| Backend  | Node.js, Express.js                 |
| Database | MongoDB, Mongoose                   |
| Auth     | JWT (jsonwebtoken), bcryptjs        |
| Validation | express-validator               |
| UI       | Custom CSS, react-hot-toast         |

---

## Deployment

### Backend (Render / Railway)
1. Push code to GitHub
2. Create new Web Service on Render
3. Set environment variables (MONGO_URI, JWT_SECRET, NODE_ENV=production)
4. Build command: `npm install` | Start: `npm start`

### Frontend (Vercel / Netlify)
1. Set `REACT_APP_API_URL=https://your-backend-url.com/api` in `.env`
2. Build: `npm run build`
3. Deploy `build/` folder

---

## Evaluation Checklist

- [x] User registration & login (JWT)
- [x] Create, update, delete, view tasks
- [x] Mark tasks as completed or pending
- [x] Responsive UI with functional components & hooks
- [x] Login, Register, Dashboard pages
- [x] Task operations (Add, Edit, Delete, Toggle)
- [x] Form validation (frontend + backend)
- [x] RESTful APIs
- [x] JWT authentication
- [x] Protected routes via middleware
- [x] User Schema: name, email, password
- [x] Task Schema: title, description, status, userId
- [x] **Bonus:** Search and filter
- [x] **Bonus:** Pagination
- [x] Clean UI and structured code
- [x] Error handling (global middleware)
