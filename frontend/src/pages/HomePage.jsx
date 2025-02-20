<<<<<<< HEAD
import { handleClick, useMobileDetect } from "../components/utilities.jsx";
import { useNavigate } from "react-router-dom";
import SideBar from "../components/SideBar.jsx";
import Board from "../components/Board.jsx";
import "../styles/HomePage.css";
import MobileSideBar from "../components/MobileSideBar.jsx";

function HomePage() {
    const isMobile = useMobileDetect();
    console.log("is it on the phone?", isMobile);
    const navigate = useNavigate();
    return (
        <>
            {isMobile ? (
                <div className="page">
=======
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
>>>>>>> efa72369a7cb309458e0731b7ff74db918251236
                    <MobileSideBar />
                    <div className="center">
                        <div style={{ padding: '10px' }}>
                            <h2>Welcome to Wythoff's Game Online</h2>
<<<<<<< HEAD
                            <div style={{ display: 'grid' }}>
=======
>>>>>>> efa72369a7cb309458e0731b7ff74db918251236
                                <button className="button" style={{ width: '100%' }} onClick={() => handleClick('play-noCPU', navigate)}>
                                    <h3>Play</h3>
                                    <p>Play with someone online</p>
                                </button>
                                <button className="button" style={{ width: '100%' }} onClick={() => handleClick('play-CPU', navigate)}>
                                    <h3>Play with Bots</h3>
                                    <p>Play vs training bots</p>
                                </button>
<<<<<<< HEAD
                            </div>
                            <Board style={{
                                justifyItself: 'center',
                                position: 'relative',
                                width:'50px'
                            }}
                                leftBalls={[0, 1, 2, 3, 4, 5, 6, 7, 8]}
                                rightBalls={[9, 10, 11, 12, 13, 14, 15]}
                                onBallClick={null} savedBalls={[]}
                                maxHeight={'150px'}
                            />
                        </div>
                        <p style={{ position: 'relative', bottom: '0' }}>@2025 Wythoff's Game Online</p>
                    </div>
                </div>
            ) : (
                <div className="page">
                    <SideBar />
                    <div className="center">
                        <div className="box">
=======
                        </div>
                        <p style={{ position: 'relative', bottom: '0' }}>@2025 Wythoff's Game Online</p>
                    </div>
                </>
            ) : (
                <>
                    <SideBar />
                    <div className="center">
                        <div style={{ display: 'flex' }}>
>>>>>>> efa72369a7cb309458e0731b7ff74db918251236
                            <Board style={{
                                justifyItself: 'center',
                                position: 'relative'
                            }}
                                leftBalls={[0, 1, 2, 3, 4, 5, 6, 7, 8]}
                                rightBalls={[9, 10, 11, 12, 13, 14, 15]}
                                onBallClick={null} savedBalls={[]}
<<<<<<< HEAD
                                maxHeight={'325px'}
=======
>>>>>>> efa72369a7cb309458e0731b7ff74db918251236
                            />
                            <div style={{ padding: '10px' }}>
                                <h2>Welcome to Wythoff's Game Online</h2>
                                <div style={{ display: 'grid' }}>
<<<<<<< HEAD
                                    <button className="button" style={{ width: '100%' }} onClick={() => handleClick('play-noCPU', navigate)}>
                                        <h3>Play</h3>
                                        <p>Play with someone online</p>
                                    </button>
                                    <button className="button" style={{ width: '100%' }} onClick={() => handleClick('play-CPU', navigate)}>
=======
                                    <button className="button main" onClick={() => handleClick('play-noCPU', navigate)}>
                                        <h3>Play</h3>
                                        <p>Play with someone online</p>
                                    </button>
                                    <button className="button main" onClick={() => handleClick('play-CPU', navigate)}>
>>>>>>> efa72369a7cb309458e0731b7ff74db918251236
                                        <h3>Play with Bots</h3>
                                        <p>Play vs training bots</p>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <p style={{ position: 'absolute', bottom: '0' }}>@2025 Wythoff's Game Online</p>
                    </div>
<<<<<<< HEAD
                </div>
            )}
        </>
=======
                </>
            )}
        </div>
>>>>>>> efa72369a7cb309458e0731b7ff74db918251236
    )
}

export default HomePage;