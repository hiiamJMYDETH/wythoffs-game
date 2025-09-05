import "../styles/page.css";
import UserDefault from "../assets/User default.svg";
import { fetching } from "./utilities";
import CPU from "../assets/CPU.svg";
import { useEffect, useState } from "react";

function Player({ name }) {
    const [win, setWin] = useState(0);
    const [loss, setLoss] = useState(0);
    const [user, setUser] = useState(null);
    const token = localStorage.getItem('token');
    useEffect(() => {
        async function loadUsers() {
            try {
                const users = await fetching('users');
                console.log('Users:', users);
                if (users[0].username != name) {
                    console.error("Error matching username");
                    return;
                }
            } catch (error) {
                console.error('Error loading users:', error.message);
                localStorage.removeItem('token');
            }
        }
        loadUsers();
    }, [name, token]);
    if (token && name != 'computer') {
        loadUsers();
    }

    var image = UserDefault;
    if (name === "computer") {
        image = CPU;
    }
    return (
        <div style={{ display: 'flex' }}>
            <img src={image} />
            <div>
                <h2>{name}</h2>
                <p>Win-Loss: {win}-{loss}</p>
            </div>
        </div>
    )
}

export default Player;