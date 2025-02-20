import { fetching, useMobileDetect, handleClick } from "../components/utilities.jsx";
import { useNavigate } from "react-router-dom";
import SideBar from "../components/SideBar.jsx";
import MobileSideBar from "../components/MobileSideBar.jsx";
import Board from "../components/Board.jsx";
import "../styles/page.css";

function HomePage() {
    const navigate = useNavigate();
    const isMobile = useMobileDetect();
    fetching('users').then((message) => {
        console.log('Message from API:', message);
    });
    return (
        <div className="page">
            {isMobile ? (
                <>
                    <MobileSideBar />
                    <div className="center">
                        <div style={{ padding: '10px' }}>
                            <h2>Welcome to Wythoff's Game Online</h2>
                                <button className="button" style={{ width: '100%' }} onClick={() => handleClick('play-noCPU', navigate)}>
                                    <h3>Play</h3>
                                    <p>Play with someone online</p>
                                </button>
                                <button className="button" style={{ width: '100%' }} onClick={() => handleClick('play-CPU', navigate)}>
                                    <h3>Play with Bots</h3>
                                    <p>Play vs training bots</p>
                                </button>
                        </div>
                        <p style={{ position: 'relative', bottom: '0' }}>@2025 Wythoff's Game Online</p>
                    </div>
                </>
            ) : (
                <>
                    <SideBar />
                    <div className="center">
                        <div style={{ display: 'flex' }}>
                            <Board style={{
                                justifyItself: 'center',
                                position: 'relative'
                            }}
                                leftBalls={[0, 1, 2, 3, 4, 5, 6, 7, 8]}
                                rightBalls={[9, 10, 11, 12, 13, 14, 15]}
                                onBallClick={null} savedBalls={[]}
                            />
                            <div style={{ padding: '10px' }}>
                                <h2>Welcome to Wythoff's Game Online</h2>
                                <div style={{ display: 'grid' }}>
                                    <button className="button main" onClick={() => handleClick('play-noCPU', navigate)}>
                                        <h3>Play</h3>
                                        <p>Play with someone online</p>
                                    </button>
                                    <button className="button main" onClick={() => handleClick('play-CPU', navigate)}>
                                        <h3>Play with Bots</h3>
                                        <p>Play vs training bots</p>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <p style={{ position: 'absolute', bottom: '0' }}>@2025 Wythoff's Game Online</p>
                    </div>
                </>
            )}
        </div>
    )
}

export default HomePage;