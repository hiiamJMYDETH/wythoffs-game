import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/HomePage.css";

function HomePage() {
    const [numberOfBalls, setNumberOfballs] = useState(20);
    const [gameSettingsBox, setGameSettingsBox] = useState(false);
    const navigate = useNavigate();

    function handleGame() {
        const minutes = document.querySelector('.minutes');
        const seconds = document.querySelector('.seconds');
        if (!minutes || !seconds) return;
        const totalSeconds = parseInt(minutes.value) * 60 + parseInt(seconds.value);
        navigate(`/game?numberOfBalls=${numberOfBalls}&maxSeconds=${totalSeconds}&wCPU=true`);
    }

    function gameSetToggle() {
        setGameSettingsBox(true);
    }

    useEffect(() => {
        const slider = document.querySelector('.slider');
        const minutes = document.querySelector('.minutes');
        const seconds = document.querySelector('.seconds');
        if (!slider || !minutes || !seconds) return;
        slider.addEventListener("click", function() {
            setNumberOfballs(slider.value);
        });
    });

    return (
        <div className="page">
            <div className="center">
                <h1>Welcome to Wythoff's Game Online</h1>
                <div className="box">
                    <button className="button" onClick={gameSetToggle}>Play Game</button>
                    {/* <button className="button">Invite Friend</button>
                    <button className="button">Options</button> */}
                </div>
            </div>
            {gameSettingsBox && (
            <div className="box game-settings">
                <h3 className="settings-text">Max Number of Balls in Game</h3>
                <div className="slider-container" style={{ display: "flex" }}>
                    <input type="range" min="10" max="20" className="slider" step="2" defaultValue="20" />
                    <h3 className="settings-text">{numberOfBalls}</h3>
                </div>
                <div className="time-container" style={{display: "flex"}}>
                    <input type="number" className="minutes" min="1" max="60" defaultValue="10" style={{backgroundColor:"white", color:"black"}}/>
                    <h3 className="settings-text">Minutes</h3>
                    <input type="number" className="seconds" min="0" max="60" defaultValue="0" style={{backgroundColor:"white", color:"black"}}/>
                    <h3 className="settings-text">Seconds</h3>
                </div>
                <button className="button" onClick={handleGame}>Start Game</button>
                <button className="button" onClick={()=>setGameSettingsBox(false)}>Exit</button>
            </div>
            )}
        </div>
    )
}

export default HomePage;