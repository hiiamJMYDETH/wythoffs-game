import { useState, useEffect, useRef } from "react";
import { useMobileDetect, fetching } from "../components/utilities.jsx";
import { useNavigate } from "react-router-dom";
import { database } from "../config/firebase.js";
import { ref, remove, onValue } from "firebase/database";
import MobileSideBar from "../components/MobileSideBar.jsx";
import GameOnline from "../components/GameOnline.jsx";
import SideBar from "../components/SideBar.jsx";

async function handleGameState(sessionId) {
  const response = await fetching("match", "POST", { sessionId });
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

function useRematch(id, player, opponent) {
  const [rematch, setRematch] = useState(null);

  useEffect(() => {
    if (!id) return;

    const rematchRef = ref(database, `rematches/${id}`);
    const unsubscribe = onValue(rematchRef, (snapshot) => {
      if (!snapshot.exists()) {
        setRematch(null);
        return;
      }

      const rematchState = snapshot.val();
      const playerState = rematchState[player];
      const opponentState = rematchState[opponent];

      if (playerState === "1" && opponentState === "1") {
        setRematch("accepted");
      } else if (playerState === "0" || opponentState === "0") {
        setRematch("declined");
      } else {
        setRematch("waiting");
      }
    });

    return () => unsubscribe();
  }, [id, player, opponent]);

  return rematch;
}

function PlayAgain({ player, opponent, id, handleGameId, handleGameOver }) {
  const status = useRematch(id, player, opponent);

  async function handleMatchClick(value) {
    await fetching("rematch", "POST", { value, player, id });
  }

  useEffect(() => {
    if (status === "accepted") {
      fetching("finalizerematch", "POST", { oldGameId: id, player, opponent });

      const newGameRef = ref(database, `rematches/${id}/newGameId`);
      const unsubscribe = onValue(newGameRef, (snapshot) => {
        if (snapshot.exists()) {
          handleGameId(snapshot.val());
          handleGameOver(false);
        }
      });

      return () => unsubscribe();
    }

    if (status === "declined") {
      remove(ref(database, `games/${id}`));
      window.location.href = "/";
    }
  }, [status, id, player, opponent, handleGameId, handleGameOver]);

  return (
    <div className="box" style={{ position: "relative" }}>
      <h2>Play Again</h2>
      <button className="button" onClick={() => handleMatchClick(true)}>
        Yes
      </button>
      <button className="button" onClick={() => handleMatchClick(false)}>
        No
      </button>

      {status === "accepted" && <p>Both players agreed! Starting new game...</p>}
      {status === "declined" && <p>One player declined</p>}
      {status === "waiting" && <p>Waiting for players to decide...</p>}
    </div>
  );
}

function GamePageOnline() {
  const navigate = useNavigate();
  const sessionId = localStorage.getItem("sessionId") || null;

  // safely parse user
  const [user] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const userId = user?.userId || null;

  const [game, setGame] = useState(null);
  const [gameOver, setGameover] = useState(false);
  const [opponent, setOpponent] = useState(null);
  const isMobile = useMobileDetect();

  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);

  // Guard: no session or user → go to login
  useEffect(() => {
    if (!sessionId || !userId) {
      localStorage.removeItem("user");
      localStorage.removeItem("sessionId");
      navigate("/login", { replace: true });
    }
  }, [sessionId, userId, navigate]);

  // Polling for matchmaking
  useEffect(() => {
    if (!sessionId || !userId) return;

    async function fetchGame() {
      try {
        const result = await handleGameState(sessionId);

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
          localStorage.removeItem("user");
          localStorage.removeItem("sessionId");
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
  }, [sessionId, userId, navigate]);

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
