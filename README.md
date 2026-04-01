# Personal Finance Management Dashboard

A full-stack web application designed to help users track income, monitor expenses, and visualize their financial health in real-time. 

##  Overview of Approach

This project utilizes a decoupled architecture, separating the client-side interface from the server-side logic to ensure scalability and maintainability:
* **Frontend:** Built with React.js and Tailwind CSS, utilizing Shadcn UI components for a modern, responsive, and accessible user experience. The state is managed globally using React Context to handle transaction filtering and user roles efficiently.
* **Backend:** Powered by Python and FastAPI, chosen for its high performance and automatic interactive API documentation. 
* **Database:** MongoDB is used as the NoSQL database, allowing for flexible document storage of transaction records.

## Features

* **Interactive Dashboard:** View high-level summaries of total balance, income, and expenses with visual trend indicators.
* **Transaction Management:** Seamlessly add, edit, and delete financial transactions in real-time.
* **Advanced Filtering & Sorting:** Search transactions by description, filter by category or type (income/expense), and sort dynamically by date or amount.
* **CSV Export:** Download your current or filtered transaction history as a clean, formatted `.csv` file.
* **Role-Based Access Control (RBAC):** Toggle between **Admin** (full edit/delete capabilities) and **Viewer** (read-only) modes.
* **Localized Formatting:** Financial values are formatted natively for the Indian Rupee (₹) using the Indian numbering system.

---

## Setup Instructions

Follow these steps to run the application locally.

### Prerequisites
* **Node.js:** Version 20 (LTS) is recommended for frontend compilation stability.
* **Python:** Version 3.8 or higher.
* **MongoDB:** Community Server running locally on the default port (`27017`).

### 1. Backend Setup

The backend requires a Python virtual environment to manage its dependencies safely.

```bash

cd backend


python -m venv venv

.\venv\Scripts\activate


pip install -r requirements.txt

uvicorn server:app --reload --port 8000
2. Frontend Setup
Open a new terminal window (keep the backend running) and set up the React application.

Bash

cd frontend

npm install --legacy-peer-deps
npm start
The application will automatically open in your browser at http://localhost:3000.

🗄️ Environment Variables
Ensure the following .env files are present in their respective directories for local development:

backend/.env


MONGO_URL="mongodb://localhost:27017"
DB_NAME="test_database"
CORS_ORIGINS="*"
frontend/.env


REACT_APP_BACKEND_URL=http://localhost:8000
