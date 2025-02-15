import Game from "../components/Game.jsx";
import Board from "../components/Board.jsx";
import SideBar from "../components/SideBar.jsx";
import MobileSideBar from "../components/MobileSideBar.jsx";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { handleClick, useMobileDetect } from "../components/utilities.jsx";
import "../styles/GamePage.css";

function GamePage() {
    const isMobile = useMobileDetect();
    const location = useLocation();
    const navigate = useNavigate();
    const params = new URLSearchParams(location.search);
    const [noParams, setParams] = useState(false);
    const CPUPlay = params.get("wCPU") === "true";
    const hasStartedParam = params.get("hasStarted") === "true";
    const [nSeconds, setSeconds] = useState(600);
    const [numberOfBalls, setNBalls] = useState(20);
    const [hasStarted, setStart] = useState(hasStartedParam);

    function handleGame() {
        const minutes = document.querySelector('.minutes');
        const seconds = document.querySelector('.seconds');
        if (!minutes || !seconds) return;
        setSeconds(parseInt(minutes.value) * 60 + parseInt(seconds.value));
        setStart(true);
        setTimeout(() => {
            navigate(`/play?wCPU=${CPUPlay}&hasStarted=true`);
        }, 0);
    }

    useEffect(() => {
        if (!params.get("wCPU") || !params.get("hasStarted")) {
            setParams(true);
        }
    }, [noParams]);

    useEffect(() => {
        const slider = document.querySelector('.slider');
        const minutes = document.querySelector('.minutes');
        const seconds = document.querySelector('.seconds');
        if (!slider || !minutes || !seconds) return;
        slider.addEventListener("click", function () {
            setNBalls(slider.value);
        });
        slider.addEventListener("touchscroll", function() {
            setNBalls(slider.value);
        })
    });

    return (
        <>
            {isMobile ? (
                <div className="page">
                    <MobileSideBar />
                    <div className="center">
                        {hasStarted ? (
                            <Game numberOfballs={numberOfBalls} maxSeconds={nSeconds} isCPUPlaying={CPUPlay} />)
                            : (
                                <div style={{ padding: '10px' }}>
                                    <h2>Play Wythoff's Game</h2>
                                    {noParams ? (
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
                                    ) : (
                                        <div style={{ display: 'grid' }}>
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
                                            <button className="button" onClick={handleGame}>Start Game</button>
                                        </div>
                                    )}
                                </div>
                            )}
                        <p style={{ position: 'relative', bottom: '0', justifyContent: 'center' }}>@2025 Wythoff's Game Online</p>
                    </div>
                </div>
            ) : (
                <div className="page" style={{ backgroundColor: '#fffbe2' }}>
                    <SideBar />
                    <div className="center">
                        {hasStarted ?
                            (<Game numberOfballs={numberOfBalls} maxSeconds={nSeconds} isCPUPlaying={CPUPlay} />) : (
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
                                        {noParams ? (
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
                                        ) : (
                                            <div style={{ display: 'grid' }}>
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
                                                <button className="button" onClick={handleGame}>Start Game</button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        <p style={{ position: 'absolute', bottom: '0', justifyContent: 'center' }}>@2025 Wythoff's Game Online</p>
                    </div>
                </div >
            )
            }
        </>
    )
}

export default GamePage;