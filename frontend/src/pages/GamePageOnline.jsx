import { useState, useEffect, useRef } from "react";
import { useMobileDetect, fetching } from "../components/utilities.jsx";
import { useNavigate } from "react-router-dom";
import { database } from "../config/firebase.js";
import { ref, onValue } from "firebase/database";
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

        const rematchRef = ref(database, `games/${id}/rematchState`);
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
            window.location.href = "/";
        }
    }, [status, id, player, opponent, handleGameId, handleGameOver]);

    return (
        <div className="box">
            <h2>Play Again</h2>
            <button className="button" onClick={() => handleMatchClick(true)}>Yes</button>
            <button className="button" onClick={() => handleMatchClick(false)}>No</button>

            {status === "accepted" && <p>Both players agreed! Starting new game...</p>}
            {status === "declined" && <p>One player declined</p>}
            {status === "waiting" && <p>Waiting for players to decide...</p>}
        </div>
    );
}


function GamePageOnline() {
    const navigate = useNavigate();
    const sessionId = localStorage.getItem("sessionId") || null;
    const [user, setUser] = useState(() => {
        const stored = localStorage.getItem('user');
        return stored ? JSON.parse(stored) : null;
    });
    const userId = user.userId ? user.userId : null;
    const [game, setGame] = useState(null);
    const [gameOver, setGameover] = useState(false);
    const [opponent, setOpponent] = useState(null);
    const isMobile = useMobileDetect();

    const intervalRef = useRef(null);
    const timeoutRef = useRef(null);

    function handleGameOver(value) {
        setGameover(value);
    }

    function handleGameId(value) {
        setGame(value);
    }

    useEffect(() => {
        if (!sessionId) {
            localStorage.removeItem("user");
            localStorage.removeItem("sessionId");
            navigate("/login");
        }
    }, [sessionId, navigate]);

    useEffect(() => {
        if (!sessionId) return;

        async function fetchGame() {
            try {
                const result = await handleGameState(sessionId);

                if (result?.gameId) {
                    setGame(result.gameId);
                    const playersArray = Array.isArray(result.players)
                        ? result.players
                        : Object.values(result.players || {});

                    const opponentId = playersArray.find(p => String(p) !== String(userId));
                    setOpponent(opponentId || null);

                    clearInterval(intervalRef.current);
                    clearTimeout(timeoutRef.current);
                }
            } catch (err) {
                console.error("Failed to fetch game state:", err);
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
    }, [sessionId]);


    return (
        <div className="page">
            {isMobile ? <MobileSideBar /> : <SideBar />}
            <div className="center">
                {gameOver && <PlayAgain player={userId} opponent={opponent} id={game} handleGameId={(value) => handleGameId(value)} handleGameOver={(value) => handleGameOver(value)}/>}
                {(game && !gameOver) ? (
                    <GameOnline id={game} player={userId} opponent={opponent} handleResult={(value) => handleGameOver(value)} />
                ) : (
                    <GameLobby />
                )}
                <p style={{ position: "relative", bottom: "0", justifyContent: "center" }}>
                    @2025 Wythoff's Game Online
                </p>
            </div>
        </div>
    );
}

export default GamePageOnline;
