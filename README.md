# Premium Task Tracker

A full-stack, aesthetically pleasing, modern Task Tracker application built with the MERN stack (MongoDB, Express, React, Node.js). 
It features a premium dark theme UI with glassmorphic elements, full authentication, and comprehensive task management capabilities.

## Features
- **Authentication**: Secure JWT-based login and registration.
- **Task Management**: Create, Read, Update, and Delete tasks.
- **Advanced Filtering**: Filter tasks by Status or Priority, search by title, sort by date, and paginate through results.
- **Analytics**: Real-time visual metrics showing total tasks, pending, and completed tasks.
- **Responsive UI**: Fully responsive on desktop, tablet, and mobile devices.
- **Premium Aesthetics**: Using Vanilla CSS with custom CSS variables, glassmorphic panels, fine-tuned shadows, and micro-animations.

## Prerequisites
- Node.js (v18 or higher recommended)
- MongoDB instance (local or MongoDB Atlas)

## Setup Instructions

### 1. Database Configuration
Make sure your MongoDB server is running. By default, the app expects MongoDB on `mongodb://localhost:27017/task_tracker`. 
You can change this in the backend `.env` file if needed.

### 2. Backend Setup
Navigate to the `backend` folder:
```bash
cd backend
npm install
npm run dev
```
*(Note: Since you might not have configured `"dev": "nodemon server.js"` in package.json yet, you can run `npx nodemon server.js` or `node server.js` instead if the script is missing).*

### 3. Frontend Setup
Navigate to the `frontend` folder from a new terminal:
```bash
cd frontend
npm install
npm run dev
```
The Vite development server will start on `http://localhost:5173`. Open this URL in your browser to view the application.

## Technologies Used
- **Backend**: Node.js, Express, MongoDB, Mongoose, JSON Web Tokens (JWT), Bcrypt.js
- **Frontend**: React, Vite, React Router, Axios, Lucide React (for icons)
- **Styling**: Pure Vanilla CSS, CSS Variables, Glassmorphism, Google Fonts ('Outfit')
