import { useMobileDetect } from "../components/utilities.jsx";
import MobileSideBar from "../components/MobileSideBar.jsx";
import Game from "../components/Game.jsx";
import MobileGame from "../components/MobileGame.jsx";
import SideBar from "../components/SideBar.jsx";
import Background from "../components/Background.jsx";

function GamePageOnline() {
    const isMobile = useMobileDetect();

    return (
        <div className="page">
            {/* <Background /> */}
            {isMobile ? (<MobileSideBar />) : (<SideBar />)}
            <div className="center">
                {isMobile ? (
                    <MobileGame isCPUPlaying={false} />
                ) : (
                    <Game isCPUPlaying={false} />
                )}
                <p style={{ position: 'relative', bottom: '0', justifyContent: 'center' }}>@2025 Wythoff's Game Online</p>
            </div>
        </div >
    )
}

export default GamePageOnline;