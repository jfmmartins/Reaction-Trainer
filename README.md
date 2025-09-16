# Reaction Trainer

A web-based game collection designed to test and improve users' reaction time, reflexes, and color recognition. Built with **React**, this project includes multiple mini-games with persistent statistics.

## 🕹️ Games Included
- **Reaction Speed** – Click the moving target as fast as possible.  
- **Reflex Challenge** – Hit multiple targets while avoiding penalty ones.  
- **Color Match** – Decide if the word matches its color.  
- **Multi Target Reflex** – Advanced reflex training with multiple targets.

## Features
- Track **reaction times** and show **last result**.
- Store and display **historical statistics** for each game.
- **Start countdown** before each game (3…2…1…Go!).
- **Stop button** to pause the game at any moment.
- Responsive game area that adapts to screen size.
- Sidebar for quick navigation between games.
- Future-ready structure for **user login and personalized scores**.

## ⚙️ Installation
1. Clone the repo:  
```bash
git clone https://github.com/<USERNAME>/<REPO>.git
```

2. Navigate to the project folder:  
```bash
cd reaction-trainer
```

3. Install dependecies
```
npm install pnpm
pnpm install
```

4. Start the app 
```
pnpm start
```


## Technologies Used

**React** – Frontend UI

**JavaScript (ES6+)** – Logic and interactivity

**HTML5 & CSS3** – Layout and styling

**LocalStorage** – Persistent storage for reaction times

(Future plans include Node.js + MongoDB integration for user accounts and cloud-based stats.)

## Usage

1. Select a game from the sidebar.

2. Press Start to begin the countdown.

3. Play the game by following the instructions.

4. Stop the game at any time to pause.

5. View historical reaction times in the stats section.

## 📂 Project Structure
```
src/
├─ components/    # UI and game components
├─ pages/         # Game pages
├─ utils/         # Storage and helper functions
├─ App.js         # Main app
```

## Future Improvements

Add user authentication and personalized profiles.

Cloud storage for game stats.

Additional mini-games and challenges.

Mobile-friendly layout and touch support.
