import { useState, useEffect } from "react";
import { useMobileDetect, fetching } from "../components/utilities.jsx";
import { useNavigate } from "react-router-dom";
import MobileSideBar from "../components/MobileSideBar.jsx";
import Game from "../components/Game.jsx";
import MobileGame from "../components/MobileGame.jsx";
import SideBar from "../components/SideBar.jsx";
import { use } from "react";

async function handleGameState(userId) {
    console.log("Handling game state for user ID:", userId);
    console.log("typeof userId:", typeof userId);
    const response = await fetching('match', 'POST', { userId: userId });
    return response;
}

function GameSettings({ handleGame }) {
    const [numberOfballs, setNumberOfballs] = useState(20);
    const [minutes, setMinutes] = useState(1);
    const [seconds, setSeconds] = useState(0);
    return (
        <div className="center" style={{
            position: 'absolute',
            width: '100%',
            height: '100%'
        }}
        >
            <div className="box" style={{ placeItems: 'center' }}>
                <p className="settings-text">Max Number of Balls in Game</p>
                <div className="slider-container" style={{ display: "flex" }}>
                    <input
                        type="range"
                        min="10"
                        max="20"
                        className="slider"
                        step="2"
                        value={numberOfballs}
                        onChange={(e) => setNumberOfballs(e.target.value)}
                    />
                    <h3 className="settings-text" style={{ margin: "0 auto" }}>
                        {numberOfballs}
                    </h3>
                </div>
                <br />
                <div className="time-container" style={{ display: "flex", justifyContent: 'center' }}>
                    <input
                        type="number"
                        className="minutes"
                        min="1"
                        max="60"
                        defaultValue={minutes}
                        onChange={(e) => setMinutes(Number(e.target.value))}
                    />
                    <h3 className="settings-text">:</h3>
                    <input
                        type="number"
                        className="seconds"
                        min="0"
                        max="59"
                        defaultValue={seconds}
                        onChange={(e) => setSeconds(Number(e.target.value))}
                    />
                </div>
                <br />
                <button className="button" onClick={handleGame}>Start Game</button>
            </div>
        </div>
    );
}

function GameLobby() {
    const isMobile = useMobileDetect();

    return (
        <div className="box">
            <div style={{
                display: "flex",
                flexDirection: "column", // Stack vertically on mobile
                justifyContent: "center",
                alignItems: "center",
                padding: "20px",
                borderBottom: "1px solid #ccc",
                marginBottom: "20px"
            }}>
                {isMobile ? <h2>Game Lobby (Mobile)</h2> : <h2>Game Lobby</h2>}
            </div>
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
                    console.log("Match found! Lobby ID:", queries.lobbyId);
                    setGame(queries.lobbyId);
                    setOpponent(queries.opponent || null);

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
                    <Game isCPUPlaying={false} />
                )
                    : (
                        < GameLobby />)}
                <p style={{ position: "relative", bottom: "0", justifyContent: "center" }}>
                    @2025 Wythoff's Game Online
                </p>
            </div>
        </div>
    );
}

export default GamePageOnline;
