import "../styles/page.css";
import UserDefault from "../assets/User default.svg";
import { fetching } from "./utilities";
import { useEffect, useState } from "react";
import CPU from "../assets/CPU.svg";

function Player({ name }) {
    const [loading, setLoading] = useState(false);
    const [win, setWin] = useState(0);
    const [loss, setLoss] = useState(0);
    const [username, setUsername] = useState(null);
    const [user, setUser] = useState(null);
    useEffect(() => {
        if (name === "computer") {
            setUsername("CPU");
            setWin(0);
            setLoss(0);
            return;
        }

        if (name === "You") {
            setUsername("You");
            setWin(0);
            setLoss(0);
            return;
        }

        async function loadUsers() {
            try {
                setLoading(true);
                const users = await fetching("users");
                if (users) {
                    const matchedUser = users.find((user) => user.id === name);
                    console.log("User: ", matchedUser);
                    if (matchedUser) {
                        const { username, win, lose } = matchedUser;
                        setUser(matchedUser);
                        setUsername(username);
                        setWin(win);
                        setLoss(lose);
                    }
                }
            } catch (error) {
                console.error("Error loading users:", error.message);
                localStorage.removeItem("token");
            } finally {
                setLoading(false);
            }
        }

        loadUsers();
    }, [name]);

    var image = name === "computer" ? CPU : UserDefault;

    return (
        <>
            {loading ? (
                <h1>...</h1>
            ) :
                (
                    <div style={{ display: 'flex' }}>
                        <img src={image} />
                        <div>
                            <h2>{username}</h2>
                            <p>Win-Loss: {win}-{loss}</p>
                        </div>
                    </div>
                )
            }
        </>
    )
}

export default Player;