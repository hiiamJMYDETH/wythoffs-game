import { useLocation } from "react-router-dom";
import { useMobileDetect } from "../components/utilities.jsx";
import MobileSideBar from "../components/MobileSideBar.jsx";
import Game from "../components/Game.jsx";
import SideBar from "../components/SideBar.jsx";

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