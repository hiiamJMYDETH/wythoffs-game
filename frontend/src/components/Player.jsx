import "../styles/page.css";
import UserDefault from "../assets/User default.svg";
import { fetchUser } from "./utilities";
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
        async function loadUser() {
            setLoading(true);
            try {
                const data = await fetchUser(name);
                if (data.user) {
                    const user = data.poolUser[0];
                    setUser(user);
                    setWin(user.win);
                    setLoss(user.lose);
                    setUsername(user.username);
                }
            } catch (err) {
                console.error(err);
                setUser(null);
            } finally {
                setLoading(false);
            }
        }
        loadUser();
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