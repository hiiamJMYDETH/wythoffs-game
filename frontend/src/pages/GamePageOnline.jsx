import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { handleClick, useMobileDetect } from "../components/utilities.jsx";
import MobileSideBar from "../components/MobileSideBar.jsx";
import Game from "../components/Game.jsx";
import Board from "../components/Board.jsx";
import SideBar from "../components/SideBar.jsx";

function GamePageOnline() {
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

    function handleGame() {
        const minutes = document.querySelector('.minutes');
        const seconds = document.querySelector('.seconds');
        // console.log("minutes: ", minutes);
        // console.log("seconds: ", seconds);
        if (!minutes || !seconds) return;
        // console.log("seconds total: ", minutes * 60 + seconds);
        // setSeconds(parseInt(minutes * 60 + seconds));
        setSeconds(parseInt(minutes.vaue) * 60 + parseInt(seconds.value));
        console.log("total seconds: ", nSeconds);
        console.log("number of balls: ", numberOfBalls);
        setStart(true);
        console.log(location)
        // setTimeout(() => {
        //     navigate(`/play?wCPU=${CPUPlay}&hasStarted=true`);
        // }, 0);
    }

    return (
        <div className="page">
            {isMobile ? (<MobileSideBar />) : (<SideBar />)}
            <div className="center">
                <Game numberOfballs={numberOfBalls} maxSeconds={nSeconds} isCPUPlaying={CPUPlay} />
                <p style={{ position: 'relative', bottom: '0', justifyContent: 'center' }}>@2025 Wythoff's Game Online</p>
            </div>
        </div >
    )
}

export default GamePageOnline;