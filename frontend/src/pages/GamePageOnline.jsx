import { useState, useEffect, useRef } from "react";
import { useMobileDetect, fetching } from "../components/utilities.jsx";
import { useNavigate } from "react-router-dom";
import { database, auth } from "../config/firebase.js";
import { ref, remove, onValue, set } from "firebase/database";
import MobileSideBar from "../components/MobileSideBar.jsx";
import GameOnline from "../components/GameOnline.jsx";
import SideBar from "../components/SideBar.jsx";

async function handleGameState(playerId) {
  const response = await fetching("match", "POST", { playerId });
  return response;
}

function GameLobby() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        textAlign: "center",
        padding: "20px",
        boxSizing: "border-box",
      }}
    >
      <p>Searching for a match...</p>
    </div>
  );
}

function useAutonomousRematch(gameId, player, opponent, handleNewGame) {
  useEffect(() => {
    if (!gameId) return;

    const rematchRef = ref(database, `rematches/${gameId}`);
    const unsubscribe = onValue(rematchRef, async (snapshot) => {
      if (!snapshot.exists()) return;

      const state = snapshot.val();
      const playerState = state[player];
      const opponentState = state[opponent];

      if (playerState === "1" && opponentState === "1" && !state.newGameId) {
        const newGameId = Date.now(); 
        await set(ref(database, `games/${newGameId}`), {
          players: [player, opponent],
          createdAt: Date.now(),
          state: "waiting",
        });

        await set(ref(database, `rematches/${gameId}/newGameId`), newGameId);
        await remove(ref(database, `games/${gameId}`));

        handleNewGame(newGameId);
      }

      if (playerState === "0" || opponentState === "0") {
        await remove(ref(database, `games/${gameId}`));
        handleNewGame(null, true); 
      }
    });

    return () => unsubscribe();
  }, [gameId, player, opponent, handleNewGame]);
}

function PlayAgain({ player, opponent, id, handleGameId, handleGameOver }) {
  useAutonomousRematch(id, player, opponent, (newGameId, declined) => {
    if (declined) {
      window.location.href = "/";
    } else {
      handleGameId(newGameId);
      handleGameOver(false);
    }
  });

  async function handleMatchClick(value) {
    const choiceRef = ref(database, `rematches/${id}`);
    await set(ref(database, `rematches/${id}/${player}`), value ? "1" : "0");
  }

  return (
    <div className="box" style={{position: 'relative'}}>
      <h2>Play Again</h2>
      <button class="button" onClick={() => handleMatchClick(true)}>Yes</button>
      <button class="button" onClick={() => handleMatchClick(false)}>No</button>
    </div>
  );
}

function GamePageOnline() {
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId') || null;
  const [game, setGame] = useState(null);
  const [gameOver, setGameover] = useState(false);
  const [opponent, setOpponent] = useState(null);
  const isMobile = useMobileDetect();

  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (!userId) {
      localStorage.removeItem("userId");
      navigate("/register", { replace: true });
    }
  }, [userId, navigate]);

  useEffect(() => {
    if (!userId) return;

    async function fetchGame() {
      try {
        const result = await handleGameState(userId);

        if (result?.gameId) {
          setGame(result.gameId);

          const playersArray = Array.isArray(result.players)
            ? result.players
            : Object.values(result.players || {});

          const opponentId = playersArray.find(
            (p) => String(p) !== String(userId)
          );
          setOpponent(opponentId || null);

          clearInterval(intervalRef.current);
          clearTimeout(timeoutRef.current);
        }
      } catch (err) {
        console.error("Failed to fetch game state:", err);

        // if backend says invalid session
        if (err.message?.includes("Unauthorized")) {
          localStorage.removeItem("userId");
          navigate("/login", { replace: true });
        }
      }
    }

    fetchGame();

    intervalRef.current = setInterval(fetchGame, 3000);
    timeoutRef.current = setTimeout(() => {
      console.warn("⏳ Matchmaking timed out after 60 seconds.");
      clearInterval(intervalRef.current);
    }, 60000);

    return () => {
      clearInterval(intervalRef.current);
      clearTimeout(timeoutRef.current);
    };
  }, [userId, navigate]);

  return (
    <div className="page">
      {isMobile ? <MobileSideBar /> : <SideBar />}
      <div className="center">
        {gameOver && (
          <PlayAgain
            player={userId}
            opponent={opponent}
            id={game}
            handleGameId={setGame}
            handleGameOver={setGameover}
          />
        )}
        {game && !gameOver ? (
          <GameOnline
            id={game}
            player={userId}
            opponent={opponent}
            handleResult={setGameover}
          />
        ) : (
          <GameLobby />
        )}
        <p style={{ position: "relative", bottom: "0", justifyContent: "center" }}>
          @2025 Wythoff&apos;s Game Online
        </p>
      </div>
    </div>
  );
}

export default GamePageOnline;
