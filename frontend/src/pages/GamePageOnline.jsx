import { useState, useEffect } from "react";
import { useMobileDetect, fetching } from "../components/utilities.jsx";
import { useNavigate } from "react-router-dom";
import MobileSideBar from "../components/MobileSideBar.jsx";
import GameOnline from "../components/GameOnline.jsx";
import SideBar from "../components/SideBar.jsx";

async function handleGameState(userId) {
    const response = await fetching('match', 'POST', { userId: userId });
    return response;
}

function GameLobby() {
    const isMobile = useMobileDetect();

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            textAlign: "center",
            padding: "20px",
            boxSizing: "border-box"
        }}>
            <div>
                <p>Loading...</p>
            </div>
        </div>
    )
}

function GamePageOnline() {
    const sessionId = localStorage.getItem("sessionId") || null;
    if (!sessionId) {
        localStorage.removeItem("user");
        localStorage.removeItem("sessionId");
        window.location.href = "/login";
    }
    const user = localStorage.getItem("user") || null;
    const userObj = user ? JSON.parse(user) : null;
    const [game, setGame] = useState(null);
    const [userId, setUserId] = useState(null);
    const [opponent, setOpponent] = useState(null);
    const isMobile = useMobileDetect();
    const navigate = useNavigate();

    useEffect(() => {
        if (!userObj) {
            localStorage.removeItem("user");
            navigate("/login");
        }
        setUserId(userObj.id);
    }, [user, navigate]);

    useEffect(() => {
        if (!userId) return; // Wait until userId is ready

        let intervalId;
        let timeoutId;

        async function fetchGame() {
            try {
                const queries = await handleGameState(userId);

                if (queries.lobbyId) {
                    console.log(queries);
                    setGame(queries.lobbyId);
                    setOpponent(queries.opponent || null);
                    console.log("Opponent found:", queries.opponent);

                    // Stop polling once we found a match
                    clearInterval(intervalId);
                }
            } catch (err) {
                console.error("Failed to fetch game state:", err);
            }
        }

        // Initial fetch immediately
        fetchGame();

        // Keep checking every 3 seconds
        intervalId = setInterval(fetchGame, 3000);

        // Stop checking after 60 seconds
        timeoutId = setTimeout(() => {
            console.warn("⏳ Matchmaking timed out after 60 seconds.");
            clearInterval(intervalId);
        }, 60000);

        // Cleanup on unmount or userId change
        return () => {
            clearInterval(intervalId);
            clearTimeout(timeoutId);
        };

    }, [userId]); // ✅ Only start polling when userId changes



    return (
        <div className="page">
            {isMobile ? <MobileSideBar /> : <SideBar />}
            <div className="center">
                {game ? (
                    <GameOnline id={game} player={userId} opponent={opponent} />
                )
                    : (
                        < GameLobby />)}
                {/* <GameOnline /> */}
                <p style={{ position: "relative", bottom: "0", justifyContent: "center" }}>
                    @2025 Wythoff's Game Online
                </p>
            </div>
        </div>
    );
}

export default GamePageOnline;
