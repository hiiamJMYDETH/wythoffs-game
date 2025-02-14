import { handleClick } from "../components/utilities.jsx";
import { useNavigate } from "react-router-dom";
import SideBar from "../components/SideBar.jsx";
import Board from "../components/Board.jsx";
import "../styles/HomePage.css";

function HomePage() {
    const navigate = useNavigate();
    return (
        <div className="page">
            <SideBar />
            <div className="center">
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
                    <div style={{padding: '10px'}}>
                        <h2>Welcome to Wythoff's Game Online</h2>
                        <div style={{display:'grid'}}>
                        <button className="button" style={{width: '100%'}} onClick={() => handleClick('play-noCPU', navigate)}>
                            <h3>Play</h3>
                            <p>Play with someone online</p>
                        </button>
                        <button className="button" style={{width: '100%'}} onClick={() => handleClick('play-CPU', navigate)}>
                            <h3>Play with Bots</h3>
                            <p>Play vs training bots</p>
                        </button>
                        </div>
                    </div>
                </div>
                <p style={{position: 'absolute', bottom: '0'}}>@2025 Wythoff's Game Online</p>
            </div>
        </div>
    )
}

export default HomePage;