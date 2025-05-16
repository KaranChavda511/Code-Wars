Here’s the complete and well-structured `README.md` file for your **Code Debugging Battle (CDB)** project:

---


# 🧠 Code Debugging Battle (CDB)

**Code Debugging Battle (CDB)** is a real-time competitive programming platform where users can participate in live debugging contests, improve their coding skills, and climb the leaderboard. It features secure user authentication, interactive battle modes, real-time code evaluation, and performance insights.

---

## 🚀 Features

- 🔐 **User Authentication & Authorization**
  - JWT-based authentication
  - Separate roles for Users and Admins

- ⚔️ **Battle Modes**
  - 1v1 Debugging Battles
  - Solo Debug Practice
  - Timed Code Fix Challenges

- ⚡ **Real-time Problem Solving**
  - Socket.io-powered live code submission and opponent tracking
  - Real-time score updates

- 🛠️ **Admin Panel**
  - Manage users and problems
  - Track platform activity

- 📊 **Leaderboard System**
  - Live global and mode-specific rankings
  - Scoring system based on performance

- 🔁 **Replay & Feedback**
  - Watch past battles
  - Analyze mistakes and performance metrics

---

## 🧩 Tech Stack

### Backend
- **Node.js** with **Express.js**
- **MongoDB** with **Mongoose**
- **Socket.io** for real-time communication
- **JWT** for authentication
- **Joi** for validation


---

## 🔄 Data Flow Diagrams (DFD)

- **Level 0 (Context Diagram)**: External entities like `User` and `Admin` interact with the system.
- **Level 1**: Includes Authentication, Problem Management, Battle Handling, Code Evaluation, and Leaderboard.
- **Level 2**: Subsystems like real-time battle sync, code comparison engine, and submission handling.
- **Level 3 (Optional)**: Detailed flow of real-time interactions using Socket.io and evaluation logic.

---

## 🛠️ Setup Instructions

Follow these steps to set up the project on your local machine:

1. Clone the repository:
   ```
   git clone https://github.com/KaranChavda511/CDB-A-Competitive-Coding-Platform.git
   cd cdb-backend-work
   ```

2. Set up the backend:
   - Navigate to the `backend` folder.
   - Install dependencies: `npm install`
   - Set up environment variables: Create a `.env` file based on `.env.example.js` file.
   - Start the backend server: `npm run dev`

3. Set up the frontend:
   - Navigate to the client folder: `cd cdb-front-work`
   - Install dependencies: `npm install`
   - Set up environment variables: Create a `.env` file based on `.env.example.js` file.
   - Start the client development server: `npm run dev`

4. Access the application:
   - Open your browser and visit: `http://localhost:5173`

---

---

## ✅ Future Enhancements

* 💡 AI-powered debugging suggestions
* 📱 Mobile-responsive frontend
* 🎯 Ranked matchmaking system
* 🎨 Monaco-based code editor

---





