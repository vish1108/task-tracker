# Task Tracker Project

A simple Task Tracker web application where users can sign up, log in, and manage their tasks. Built with **React** for the frontend and **Node.js + Express** for the backend. Uses **JWT authentication** and an in-memory store for tasks.

---

## Tech Stack

- **Frontend:** React (functional components + Hooks)
- **Backend:** Node.js + Express
- **Auth:** JWT
- **Database:** In-memory store 
- **Dev Tools:** ESLint, Prettier 

---

## Features

### User Authentication
- Signup and Login with email & password
- JWT-based authentication
- Protect all task routes for logged-in users

### Task CRUD
- **Create:** Add a new task with title, due date, and completed status
- **Read:** List all tasks, view single task details
- **Update:** Edit title/due date, mark complete/incomplete
- **Delete:** Remove a task

### Frontend Views
- **Public:** Signup page, Login page
- **Protected:** Dashboard showing task list, Task form for create/edit, Task details

### Other
- Persist JWT in `localStorage`
- Display error messages for invalid inputs
- Simple loading indicators

---

---

## Setup Instructions

### 1. Clone the repository
    git clone https://github.com/vish1108/task-tracker
    cd task-tracker

## Backend setup
    cd backend
    npm install
    node server.js

## Frontend setup 
```bash
cd frontend
npm install
npm start


