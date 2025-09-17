# Reaction Trainer

A full-stack web application designed to test and improve a user's reaction time, reflexes, and color recognition. This project features multiple mini-games with **user authentication**, **cloud-based score storage**, and personalized statistics.

## 🕹️ Games Included
- **Reaction Speed** – Click a moving target as fast as possible.
- **Color Match** – Decide if the word matches its color.
- **Reflex Challenge** – Hit the correct color target to score points.

---

## Features
- **User Authentication**: Secure user login and registration.
- **Persistent Stats**: All game scores are saved to a **MongoDB** database, accessible from any device.
- **Personalized Stats**: View your own historical performance, including average reaction times and progress over time.
- **Global Leaderboard**: Compete with other users and see the top average scores for each game.
- **Real-time Feedback**: Get instant visual feedback (green for correct, red for incorrect) and penalty times for mistakes.
- **Start Countdown**: A 3-2-1 countdown before each game begins.
- **Responsive Design**: The game adapts to different screen sizes.

---

## ⚙️ Installation
To get started, you'll need to set up both the frontend and the backend.

### **1. Clone the Repository**
```bash
git clone https://github.com/jfmmartins/Reaction-Trainer.git
cd reaction-trainer
```

### **2. Frontend Setup**
From the project's root directory, install the dependencies and start the React app.
```bash
npm pnpm
pnpm start
```

### **3. Backend Setup**
Navigate to the `server` directory, install its dependencies, and create a `.env` file.
```bash
cd server
npm install
```

Your `.env` file should contain the following:
```bash
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=a_strong_random_secret
```
Then, start the server:
```
pnpm start
```
The server will run on port `5000`.

---

## 💻 Technologies Used
**Frontend**
- **React** – For building the user interface.
- **JavaScript (ES6+)** – For logic and interactivity.
- **HTML5 & CSS3** – For layout and styling.
- **`Recharts`** – For creating the dynamic stats graph.

**Backend**
- **Node.js** – Server-side runtime environment.
- **Express.js** – Web framework for creating API routes.
- **MongoDB** – A NoSQL database for storing user data and scores.
- **Mongoose** – An ODM for interacting with MongoDB.
- **JWT (JSON Web Tokens)** – For secure user authentication.

---

## 📂 Project Structure
```
reaction-trainer/
├─ public/
├─ src/
│  ├─ assets/         # Game videos and images
│  ├─ components/     # UI elements (Leaderboard, GameWrapper)
│  ├─ games/          # Individual game components (ReactionSpeed, ColorMatch)
│  ├─ pages/          # Full-page components (Home, Stats)
│  ├─ utils/          # Helper functions (storage, API calls)
│  ├─ App.js
│  ├─ index.js
├─ server/
│  ├─ middleware/     # Auth middleware
│  ├─ models/         # Mongoose models (User, Score)
│  ├─ .env            # Environment variables
│  ├─ server.js       # Main backend server
│  ├─ package.json
├─ .gitignore
├─ README.md
├─ package.json
```

--- 

## Future Improvements
- **Game Customization**: Allow users to adjust game difficulty (e.g., change the number of targets, color variations, or speed).
- **Gamification**: Introduce achievements, badges, or a leveling system to keep users engaged.
- **Historical Trends**: Add more advanced charting in the stats section to show trends like best times, worst times, and progress over time.
- **Mobile-First Design**: Fully optimize the layout and touch controls for an excellent mobile experience.
- **Password Reset**: Implement a secure password reset functionality for registered users.