import "../styles/page.css";

function Player({ name }) {
    return (
        <div style={{display:'flex'}}>
            <div>
                <h2>{name}</h2>
                <p>Win-Loss: 0-0</p>
            </div>
        </div>
    )
}

export default Player;