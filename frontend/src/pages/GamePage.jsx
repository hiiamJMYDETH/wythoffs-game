import Game from "../components/Game.jsx";
import { useNavigate } from "react-router-dom";
import "../styles/GamePage.css";

function GamePage() {
    const navigate = useNavigate();
    function handleExit() {
        navigate("/");
    }
    return (
        <div className="page" style={{backgroundColor: '#fffbe2'}}>
            <button className="button" onClick={handleExit} style={{width:'10px', position: 'absolute'}}>X</button>
            <Game />
        </div> 
    )
}

export default GamePage;