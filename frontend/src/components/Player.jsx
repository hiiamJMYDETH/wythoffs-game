import "../styles/page.css";
import UserDefault from "../assets/User default.svg";
import CPU from "../assets/CPU.svg";

function Player({ name }) {
    var image = UserDefault;
    if (name === "computer") {
        image = CPU;
    }
    return (
        <div style={{display:'flex'}}>
            <img src={image} />
            <div>
                <h2>{name}</h2>
                <p>Win-Loss: 0-0</p>
            </div>
        </div>
    )
}

export default Player;