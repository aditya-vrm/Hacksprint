# DevHub Backend 🚀

Backend API for DevHub — a developer social platform where users can:

- Register & Login
- Create Projects
- Create Blogs
- Real-time Chat using Socket.IO
- Authentication using JWT
- MongoDB Database Integration

---

# Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Socket.IO
- bcrypt
- express-validator

---

# Folder Structure

```bash
backend/
│
├── src/
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── blog.controller.js
│   │   ├── chat.controller.js
│   │   └── project.controller.js
│   │
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   └── validator.middleware.js
│   │
│   ├── models/
│   │   ├── user.model.js
│   │   ├── project.model.js
│   │   ├── blog.model.js
│   │   └── message.model.js
│   │
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── blog.routes.js
│   │   ├── chat.routes.js
│   │   └── project.routes.js
│   │
│   ├── socket/
│   │   └── socket.js
│   │
│   ├── db/
│   │   └── db.js
│   │
│   └── app.js
│
├── .env
├── package.json
├── server.js
└── README.md
```

---

# Features

## Authentication

- Register User
- Login User
- JWT Authentication
- Protected Routes
- Cookie Based Authentication

---

## Projects

Users can:

- Create Projects
- Add GitHub Repository Link
- Add Deployment Link
- Manage their projects

---

## Blogs

Users can:

- Create Blogs
- Add blog title
- Add summary
- Add content
- Edit Blogs

---

## Real-time Chat

Implemented using Socket.IO.

Features:

- User Rooms
- Real-time Messaging
- Sender/Receiver Events
- Store Messages in MongoDB

---

# Installation

## 1. Clone Repository

```bash
git clone <your_repo_url>
```

---

## 2. Move to Backend Folder

```bash
cd backend
```

---

## 3. Install Dependencies

```bash
npm install
```

---

## 4. Setup Environment Variables

Create a `.env` file:

```env
PORT=3000

MONGODB_URI=your_mongodb_url

JWT_SECRET=your_secret_key
```

---

# Running Server

```bash
npm run dev
```

Expected Output:

```bash
Server running on port 3000
connected to db
```

---

# User Model

```js
{
  fullname: String,
  username: String,
  email: String,
  dob: Date,
  gender: String,
  password: String,
  role: String
}
```

---

# Authentication APIs

# Register User

## Endpoint

```http
POST /api/auth/register
```

## Request Body

```json
{
  "fullname": "Nayan Mahato",
  "username": "nayan",
  "email": "nayan@gmail.com",
  "dob": "2004-08-10",
  "gender": "male",
  "password": "123456",
  "confirmPassword": "123456"
}
```

---

# Login User

## Endpoint

```http
POST /api/auth/login
```

## Request Body

```json
{
  "email": "nayan@gmail.com",
  "password": "123456"
}
```

---

# Project APIs

# Create Project

## Endpoint

```http
POST /api/projects/create
```

## Headers

```http
Authorization: Bearer TOKEN
```

## Request Body

```json
{
  "projectName": "DevHub",
  "githubRepo": "https://github.com/user/devhub",
  "deploymentLink": "https://devhub.vercel.app"
}
```

---

# Blog APIs

# Create Blog

## Endpoint

```http
POST /api/blogs/create
```

## Request Body

```json
{
  "title": "How I Built DevHub",
  "summary": "Complete backend architecture explanation",
  "content": "This is blog content..."
}
```

---

# Socket.IO Documentation

# Connection

```js
const socket = io("http://localhost:3000");
```

---

# Join User Room

```js
socket.emit("join", userId);
```

---

# Send Message

```js
socket.emit("send_message", {
  sender: "sender_id",
  receiver: "receiver_id",
  text: "hello"
});
```

---

# Receive Message

```js
socket.on("receive_message", (message) => {
  console.log(message);
});
```

---

# Middleware

## auth.middleware.js

Purpose:

- Verify JWT Token
- Protect Routes
- Attach user to request

---

# Validation

Using:

```bash
express-validator
```

Validation includes:

- Email validation
- Password validation
- Confirm password matching
- Username validation
- Gender validation

---

# Dependencies

```bash
npm install express mongoose dotenv bcrypt jsonwebtoken cookie-parser cors express-validator socket.io
```

---

# Development Dependencies

```bash
npm install nodemon --save-dev
```

---

# Scripts

```json
"scripts": {
  "dev": "node server.js"
}
```

---

# Future Improvements

- Image Uploads
- Comments System
- Notifications
- Friend Requests
- GitHub API Integration
- Like & Save Posts
- Admin Dashboard
- Search System
- AI Features

---

# Security

- Password Hashing using bcrypt
- JWT Authentication
- Protected APIs
- HTTP-only Cookies

---

# Author

Built by Nayan Mahato 🚀
