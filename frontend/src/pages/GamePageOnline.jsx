import { useState, useEffect, useRef } from "react";
import { useMobileDetect, fetching } from "../components/utilities.jsx";
import { useNavigate } from "react-router-dom";
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

function GamePageOnline() {
    const navigate = useNavigate();
    const sessionId = localStorage.getItem("sessionId") || null;
    const [user, setUser] = useState(() => {
        const stored = localStorage.getItem('user');
        return stored ? JSON.parse(stored) : null;
    });
    const userId = user.userId ? user.userId : null;
    const [game, setGame] = useState(null);
    const [opponent, setOpponent] = useState(null);
    const isMobile = useMobileDetect();
    // const [out, setOut] = useState(false);

    const intervalRef = useRef(null);
    const timeoutRef = useRef(null);

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
                {game ? (
                    <GameOnline id={game} player={userId} opponent={opponent} />
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
