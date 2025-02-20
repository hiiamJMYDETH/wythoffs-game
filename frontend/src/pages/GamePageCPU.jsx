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

function GamePageCPU() {
    const isMobile = useMobileDetect();
    const location = useLocation();
    const CPUPlay = location.pathname === '/play/computer' ? true : false;

    return (
        <div className="page">
            {isMobile ? (<MobileSideBar />) : (<SideBar />)}
            <div className="center">
                <Game isCPUPlaying={CPUPlay} />
                <p style={{ position: 'relative', bottom: '0', justifyContent: 'center' }}>@2025 Wythoff's Game Online</p>
            </div>
        </div >
    )
}

export default GamePageCPU;