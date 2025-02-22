import { useMobileDetect } from "../components/utilities.jsx";
import MobileSideBar from "../components/MobileSideBar.jsx";
import Game from "../components/Game.jsx";
import SideBar from "../components/SideBar.jsx";

function GamePageOnline() {
    const isMobile = useMobileDetect();

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