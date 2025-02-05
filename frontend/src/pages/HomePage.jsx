import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/HomePage.css";

function HomePage() {
    const [numberOfBalls, setNumberOfballs] = useState(20);
    const navigate = useNavigate();

    function handleGame() {
        navigate("/game");
    }

    // useEffect(() => {
    //     const slider = document.querySelector('.slider');
    //     slider.addEventListener("click", function() {
    //         setNumberOfballs(slider.value);
    //     });
    // });

    return (
        <div className="page">
            <div className="center">
                <h1>Welcome to Wythoff's Game Online</h1>
                <div className="box">
                    <button className="button" onClick={handleGame}>Play Game</button>
                    {/* <div className="slider-container" style={{display:"flex"}}>
                        <input type="range" min="10" max="50" className="slider" step="2" defaultValue="20"/>
                        <h2>{numberOfBalls}</h2>
                    </div> */}
                    {/* <button className="button">Invite Friend</button>
                    <button className="button">Options</button> */}
                </div>
            </div>
        </div>
    )
}

export default HomePage;