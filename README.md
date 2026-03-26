# Premium Task Tracker - https://task-tracker-ond1.vercel.app/

A full-stack, aesthetically pleasing, modern Task Tracker application built from scratch with the MERN stack (MongoDB, Express, React, Node.js). 

## 🎨 Design Choices & Architecture
- **Glassmorphism UI:** Built gracefully with pure, Vanilla CSS, featuring frosted glass panels (`backdrop-filter: blur`), glowing primary color accents, and smooth micro-animations to create a highly premium user feel.
- **Serverless-Optimized Backend:** The Express.js backend features a specialized database connection handler mapping requests to MongoDB Atlas exclusively *after* ensuring a stable connection. This was specifically built to prevent cold-start buffering timeout issues on Vercel Serverless Functions.
- **Dynamic Client-Side Routing:** Managed by React Router DOM, cleanly dividing authenticated dashboard screens from public authorization flows.
- **State & Auth Management:** Context API is used to manage global user state. JSON Web Tokens (JWT) are securely attached automatically to every outgoing Axios request using robust interceptors.

## 🚀 Setup & Local Deployment

### 1. Database & Environment Setup
Ensure you have a MongoDB cluster running (either local or Atlas). 
Create a `.env` file in the `backend` folder:
```text
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

### 2. Run the Backend Server
Navigate to the `backend` folder:
```bash
cd backend
npm install
npm run dev
```

### 3. Run the Frontend App
Navigate to the `frontend` folder from a new terminal:
```bash
cd frontend
npm install
npm run dev
```
Open the Vite local URL (usually `http://localhost:5173`) in your browser.

## 📡 API Endpoints

### Authentication (`/api/auth`)
- **`POST /signup`**: Register a new user. Expects `{ name, email, password }`. Returns a JWT token and user profile.
- **`POST /login`**: Authenticate a user. Expects `{ email, password }`. Returns a JWT token and user profile.

### Tasks (`/api/tasks`)
*All task routes require a valid Bearer Token in the `Authorization` header.*
- **`GET /`**: Fetch all tasks for the logged-in user. Supports query parameters for `page`, `limit`, `search`, `status`, `priority`, and `sortby`.
- **`POST /`**: Create a new task. Expects `{ title, description, status, priority }`.
- **`PUT /:id`**: Update an existing task by its `_id`. 
- **`DELETE /:id`**: Delete a task by its `_id`.
- **`GET /analytics`**: Returns aggregated count metrics grouped by task status (`Pending`, `In Progress`, `Completed`), allowing the frontend to generate live charts.

## 🛠 Technologies Used
- **Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT, Bcrypt.js
- **Frontend:** React, Vite, React Router DOM, Axios, Lucide React (Icons)
- **Deployment:** Configured precisely for seamless Vercel deployment with `vercel.json` rewrites and serverless cold-start optimizations inline.
