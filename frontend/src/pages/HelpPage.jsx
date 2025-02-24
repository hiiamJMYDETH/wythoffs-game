import Background from "../components/Background";
import MobileSideBar from "../components/MobileSideBar";
import SideBar from "../components/SideBar";
import { useMobileDetect } from "../components/utilities";
import "../styles/page.css";

function HelpPage() {
    const isMobile = useMobileDetect();
    return (
        <div className="page">
            {/* <Background /> */}
            {isMobile ? (
                <MobileSideBar />
            ) : (
                <SideBar />
            )}
            <div className="center">
                <div className="box" style={{
                    justifyItems: 'center',
                    display: 'grid',
                    position: 'relative',
                    zIndex: '0',
                    maxWidth: '500px',
                    border:'none'
                }}>
                    <h2>How to Play</h2>
                    <p>
                        This game is a simple version that allows local multiplayer in which it allows players to play the game. Here're some rules to it.
                    </p>
                    <li>
                        <ol>
                            <p>Player can pick marbles on either one or both sides. But if the player pick marbles on both sides, they have to be the same amount.</p>
                        </ol>
                        <ol>
                            <p>Whoever picks the last marble wins.</p>
                        </ol>
                    </li>
                </div>
                {isMobile ? (
                    <p style={{ position: 'relative', bottom: '0' }}>@2025 Wythoff's Game Online</p>
                ) : (
                    <p style={{ position: 'relative', bottom: '0', justifyContent: 'center' }}>@2025 Wythoff's Game Online</p>
                )}
            </div>
        </div >
    )
}

export default HelpPage;