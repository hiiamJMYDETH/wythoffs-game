import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { handleClick, useMobileDetect } from "../components/utilities.jsx";
import MobileSideBar from "../components/MobileSideBar.jsx";
import Board from "../components/Board.jsx";
import SideBar from "../components/SideBar.jsx";

function PlayPage() {
    const isMobile = useMobileDetect();
    const navigate = useNavigate();

    return (
        <div className="page">
            {isMobile ? (
                <>
                    <MobileSideBar />
                    <div style={{ padding: '10px' }}>
                        <div style={{ display: 'grid' }}>
                        <h2>Play Wythoff's Game</h2>
                            <button className="button main" style={{ width: '100%' }} onClick={() => handleClick('play-noCPU', navigate)}>
                                <h3>Play</h3>
                                <p>Play with someone online</p>
                            </button>
                            <br />
                            <button className="button main" style={{ width: '100%' }} onClick={() => handleClick('play-CPU', navigate)}>
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
                        <div style={{ display: 'flex' }}>
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
                                        <button className="button main" style={{ width: '100%' }} onClick={() => handleClick('play-noCPU', navigate)}>
                                            <h3>Play</h3>
                                            <p>Play with someone online</p>
                                        </button>
                                        <br />
                                        <button className="button main" style={{ width: '100%' }} onClick={() => handleClick('play-CPU', navigate)}>
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