import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { handleClick, useMobileDetect } from "../components/utilities.jsx";
import MobileSideBar from "../components/MobileSideBar.jsx";
import Game from "../components/Game.jsx";
import Board from "../components/Board.jsx";
import SideBar from "../components/SideBar.jsx";

function GameSettings({ numberOfBalls, handleGame, functionBalls }) {
    useEffect(() => {
        const slider = document.querySelector('.slider');
        const minutes = document.querySelector('.minutes');
        const seconds = document.querySelector('.seconds');
        if (!slider || !minutes || !seconds) return;
        slider.addEventListener("click", function () {
            functionBalls(slider.value);
        });
        slider.addEventListener("touchscroll", function () {
            functionBalls(slider.value);
        })
    });
    return (
        <div>
            <h3 className="settings-text">Max Number of Balls in Game</h3>
            <div className="slider-container" style={{ display: "flex" }}>
                <input type="range" min="10" max="20" className="slider" step="2" defaultValue="20" />
                <h3 className="settings-text">{numberOfBalls}</h3>
            </div>
            <div className="time-container" style={{ display: "flex" }}>
                <input type="number" className="minutes" min="1" max="60" defaultValue="10" style={{ backgroundColor: "white", color: "black" }} />
                <h3 className="settings-text">Minutes</h3>
                <input type="number" className="seconds" min="0" max="60" defaultValue="0" style={{ backgroundColor: "white", color: "black" }} />
                <h3 className="settings-text">Seconds</h3>
            </div>
            <button className="button" onClick={() => { handleGame(document.querySelector('.minutes').value, document.querySelector('.seconds').value) }}>Start Game</button>
        </div>
    )
}

function PlayPage() {
    const isMobile = useMobileDetect();
    const location = useLocation();
    const navigate = useNavigate();
    const params = new URLSearchParams(location.search);
    const [noParams, setParams] = useState(false);
    const CPUPlay = location.pathname === '/play/computer' ? true : false;
    const hasStartedParam = params.get("hasStarted") === "true";
    const [nSeconds, setSeconds] = useState(600);
    const [numberOfBalls, setNBalls] = useState(20);
    const [hasStarted, setStart] = useState(hasStartedParam);

    return (
        <div className="page">
            {isMobile ? (
                <>
                    <MobileSideBar />
                    <div className="center">
                        <div style={{ display: 'grid' }}>
                        <h2>Play Wythoff's Game</h2>
                            <button className="button" style={{ width: '100%' }} onClick={() => handleClick('play-noCPU', navigate)}>
                                <h3>Play</h3>
                                <p>Play with someone online</p>
                            </button>
                            <button className="button" style={{ width: '100%' }} onClick={() => handleClick('play-CPU', navigate)}>
                                <h3>Play with Bots</h3>
                                <p>Play vs training bots</p>
                            </button>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <SideBar />
                    <div className="center">
                        <div className="box">
                            <Board style={{
                                justifyItself: 'center',
                                position: 'relative'
                            }}
                                leftBalls={[0, 1, 2, 3, 4, 5, 6, 7, 8]}
                                rightBalls={[9, 10, 11, 12, 13, 14, 15]}
                                onBallClick={null} savedBalls={[]}
                                maxHeight={'325px'}
                            />
                            <div style={{ padding: '10px' }}>
                                <h2>Play Wythoff's Game</h2>
                                <div style={{ display: 'grid' }}>
                                        <button className="button" style={{ width: '100%' }} onClick={() => handleClick('play-noCPU', navigate)}>
                                            <h3>Play</h3>
                                            <p>Play with someone online</p>
                                        </button>
                                        <button className="button" style={{ width: '100%' }} onClick={() => handleClick('play-CPU', navigate)}>
                                            <h3>Play with Bots</h3>
                                            <p>Play vs training bots</p>
                                        </button>
                                    </div>
                            </div>
                        </div>
                        <p style={{ position: 'absolute', bottom: '0', justifyContent: 'center' }}>@2025 Wythoff's Game Online</p>
                    </div>
                </>
            )}
        </div>
    )
}

export default PlayPage;