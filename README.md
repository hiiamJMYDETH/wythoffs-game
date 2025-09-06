# Wythoff's Game Online 🎮

An online game version to play the mathematical subtraction game, Wythoff's Game

![wythoffs-game-img](./frontend/src/assets/Screenshot%200007-09-05%20at%2018.21.07.png)

## 📌 Overview

### 🎯 Inspiration

From the creator, one of the problems of the first season of the hit Netflix show, Squid Game, is that some of the strategies are very dumb. One of the games is related to marbles. The games played in this event are notoriously luck based and forces the player to be so full of itself, when it's not. That's where this game comes in! This game doesn't rely on luck or constant betting. It relies on your mind. 

Here're some rules to it. 

1. Player can pick marbles on either one or both sides. But if the player pick marbles on both sides, they have to be the same amount.
2. Whoever picks the last marble wins.

With Wythoff's Game Online, you can:

- ✔️ Play online against other players in the world
- ✔️ Try locally against a computer

### 🚀 Core Features
- Profile Settings: Allow the user to change username and password
- Game Interface: Allow easy interaction of the game
- Game Settings: Allow nuance in how the game is set up to be played

### ⚒️ Technologies Used
- Backend: Vercel API serverless functions, Redis, Firebase, PostgreSQL (using Neon)
- Frontend: React (using Vite)

## Setup
### 1. Go to the branch local_deploy
On the GitHub page, go to branches and search for the branch `local_deploy`. 
### 2. Clone the repository
```
git clone https://github.com/hiiamJMYDETH/wythoffs-game/tree/local_deploy
cd wythoffs-game
```
### 3. Install Dependencies
```
yarn install
```
### 4. Create Environment Variables
* Create an .env file
* Add .env in gitignore to hide API keys (please don't use the ones somewhat provided)
* Add these environment variables
```
VITE_API_URL=your_vite_api_url
LOCAL_API_URL=your_local_api_url
DATABASE_URL=your_pg_database_url
UPSTASH_REDIS_URL=your_upstash_redis_url
ACCESS_TOKEN_SECRET=any_secret
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
FIREBASE_PROJECT_ID=your_firebase_proj_id
FIREBASE_STORAGE_BUCKET=your_firebase_stor_bucket
FIREBASE_MESSAGING_SENDER_ID=your_firebase_msi
FIREBASE_APP_ID=your_firebase_app_id
FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id
FIREBASE_DB_URL=your_firebase_db_url
```
### 5. Install Vercel with this settings
```
{
  "routes": [
    { "src": "/api/(.*)", "dest": "/api/$1" }
  ],
  "crons": [
    {
      "path": "/api/autoCleanSessions",
      "schedule": "0 * * * *"
    }
  ]
  }
```
### 6. Start the Frontend
```
npm run dev --prefix frontend
```
### 7. Start the Backend
Split the terminal or open a new one
```
vercel dev
```
Visit https://localhost:5173 in your browser
Your app is now ready to use!

## Contributing
1. Fork the repository
2. Create your own feature branch from the local development (`git checkout -b feature/amazing_feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push your changes (`git push`)
5. Attempt to message the owner on GitHub

Please let me know if there are any problems when contributing. 
Enjoy!