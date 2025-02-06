import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
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
        navigate(`/game?numberOfBalls=${numberOfBalls}&maxSeconds=${totalSeconds}`);
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
        // minutes.addEventListener("click", function() {
        //     setMaxSeconds()
        // });
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
                <p>Max Number of Balls in Game</p>
                <div className="slider-container" style={{ display: "flex" }}>
                    <input type="range" min="10" max="20" className="slider" step="2" defaultValue="20" />
                    <h2>{numberOfBalls}</h2>
                </div>
                <div className="time-container" style={{display: "flex"}}>
                    <input type="number" className="minutes" min="1" max="60" defaultValue="10" style={{backgroundColor:"white", color:"black"}}/>
                    <p>Minutes</p>
                    <input type="number" className="seconds" min="0" max="60" defaultValue="0" style={{backgroundColor:"white", color:"black"}}/>
                    <p>Seconds</p>
                </div>
                <button className="button" onClick={handleGame}>Start Game</button>
                <button className="button" onClick={()=>setGameSettingsBox(false)}>Exit</button>
            </div>
            )}
        </div>
    )
}

export default HomePage;