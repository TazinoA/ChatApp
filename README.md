# ChatApp

A real-time chat application with a React frontend and a Node.js (Express + Socket.IO) backend powered by PostgreSQL.

Visit the live site: https://chatapp-oyd6.onrender.com/

## Features

- **Authenticated Socket Connections**: Socket.IO handshakes are authenticated with JWT HTTP-only cookies.
- **Real-time Messaging**: Multi-device tab synchronization and instant message delivery.
- **Conversations & Search**: Paginated conversation history with last message metadata and user search.
- **Secure Authentication**: Server-side Google ID token verification, bcrypt password hashing, and generic invalid credential responses.
- **Light & Dark Theme**: Built-in theme switcher supporting both dark and light modes.
- **Robust Security**: Security headers (`helmet`), API rate limiting, and input shape validation.

## Local Development Setup

To run this project locally, set up the backend and the frontend separately.

### Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the `backend` directory with the following configuration:
   ```env
   PORT=5000
   JWT_ACCESS_SECRET=your_jwt_secret_key_here
   CLIENT_URL=http://localhost:3000

   # Database Configuration (Local)
   DB_USER=postgres
   DB_HOST=localhost
   DB_NAME=ChatApp
   DB_PASSWORD=postgres
   DB_PORT=5432

   # Database Configuration (Production / Cloud)
   # DB_URL=postgresql://user:password@host:5432/dbname
   ```

4. **Start the backend development server:**
   ```bash
   npm run dev
   ```
   The backend server will run on `http://localhost:5000`.

### Frontend Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the frontend development server:**
   ```bash
   npm run dev
   ```
   The frontend Vite development server will run on `http://localhost:5173` or `http://localhost:3000`.

## Building for Production

To build the frontend assets:
```bash
npm run build
```

To start the production server:
```bash
npm start
```
