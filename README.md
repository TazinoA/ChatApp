# ChatApp

This is a simple chat application with a React frontend and a Node.js (Express) backend.Visit the live site: https://chatapp-oyd6.onrender.com/

## Local Development Setup

To run this project locally, you will need to set up the backend and the frontend separately.

### Backend Setup

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the `backend` directory with the following variables for your PostgreSQL database:
    ```
    DB_USER
    DB_HOST
    DB_PASSWORD
    DB_PORT
    ```

4.  **Start the backend server:**
    ```bash
    npm start
    ```
    The backend server will be running on `http://localhost:3000`.

### Frontend Setup

1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Start the frontend development server:**
    ```bash
    npm run dev
    ```
    The frontend development server will be running on `http://localhost:3000`.

## Running the App

1.  Start the backend server from the `backend` directory.
2.  Start the frontend server from the `frontend` directory.
3.  Open your browser and navigate to `http://localhost:3000`.
