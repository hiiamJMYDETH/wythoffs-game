import Game from "../components/Game.jsx";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/GamePage.css";

function GamePage() {
    const navigate = useNavigate();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const nBalls = params.get("numberOfBalls");
    const nSeconds = params.get("maxSeconds");
    function handleExit() {
        navigate("/");
    }
    return (
        <div className="page" style={{backgroundColor: '#fffbe2'}}>
            <button className="button" onClick={handleExit} style={{width:'10px', position: 'absolute'}}>X</button>
            <Game numberOfballs={nBalls} maxSeconds={nSeconds} />
        </div> 
    )
}

export default GamePage;