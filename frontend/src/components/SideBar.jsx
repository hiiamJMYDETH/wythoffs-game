import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/SideBar.css";
import { handleClick, fetching } from "./utilities";
import PlayImage from "../assets/Play.svg";
import UserDefault from "../assets/User default.svg";
import SettingsIcon from "../assets/Settings.svg";
import HelpIcon from "../assets/Help.svg";

async function fetchUser(userId, setter) {
    const apiUrl =
        import.meta.env.VITE_API_URL ||
        (import.meta.env.DEV ? import.meta.env.LOCAL_API_URL : "/api");

    const options = {
        method: 'GET',
        credentials: "include",
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const url = `${apiUrl}/loaduserid?userId=${encodeURIComponent(userId)}`;
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP error! status ${response.status}`);
        }
        const responseJson = await response.json();
        setter(responseJson.user);

    }
    catch (err) {
        console.error("Error loading users: ", err.message);
        localStorage.removeItem('userId');
        setter(null);
    }
}

// async function fetching(req, reqMethod = 'GET', reqData = "Your data here") {
//     const apiUrl =
//         import.meta.env.VITE_API_URL ||
//         (import.meta.env.DEV ? import.meta.env.LOCAL_API_URL : "/api");


//     const options = {
//         method: reqMethod,
//         credentials: "include",
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `User ${localStorage.getItem('userId')} || ''}`
//         }
//     };

//     if ((reqMethod === 'POST' || reqMethod === 'PUT') && reqData !== "Your data here") {
//         options.body = JSON.stringify(reqData);
//     }

//     try {
//         const response = await fetch(`${apiUrl}/${req}`, options);

//         // Read the body as text once
//         const text = await response.text();
//         console.log("Raw response:", text);

//         if (!response.ok) {
//             throw new Error(`API request failed: ${response.status} ${response.statusText} - ${text}`);
//         }

//         // Try to parse JSON
//         try {
//             return JSON.parse(text);
//         } catch {
//             return text || 'No message received';
//         }
//     } catch (error) {
//         throw new Error(`Fetch error: ${error.message}`);
//     }
// }


function SideBar() {
    const [playOpts, setPlayOpts] = useState(false);
    const [user, setUser] = useState(null);
    const userId = localStorage.getItem('userId') || null;
    const navigate = useNavigate();
    const play = useRef(null);
    const playMenu = useRef(null);
    const menu = useRef(null);
    // const token = localStorage.getItem('sessionId') || null;

    useEffect(() => {
        // async function loadUsers() {
        //     try {
        //         const users = await fetching('loaduserid', 'GET', { userId });
        //         console.log('Users:', users);
        //         localStorage.setItem('user', JSON.stringify(users));
        //         setUser(users);

        //     } catch (error) {
        //         console.error('Error loading users:', error.message);
        //         localStorage.removeItem('user');
        //         setUser(null);
        //     }
        // }
        fetchUser(userId, setUser);
        // loadUsers();
    }, [userId]);

    useEffect(() => {
        if (!play.current) return;
        const playEl = play.current;
        const playMenuEl = playMenu.current;

        const showMenu = () => setPlayOpts(true);
        const hideMenu = (e) => {
            if (
                playEl.contains(e.relatedTarget) ||
                (playMenuEl && playMenuEl.contains(e.relatedTarget))
            ) {
                return;
            }
            setPlayOpts(false);
        }

        playEl.addEventListener("mouseenter", showMenu);
        playEl.addEventListener("mouseleave", hideMenu);

        if (playMenuEl) {
            playMenuEl.addEventListener("mouseenter", showMenu);
            playMenuEl.addEventListener("mouseleave", hideMenu)
        }

        return () => {
            playEl.addEventListener("mouseenter", showMenu);
            playEl.addEventListener("mouseleave", hideMenu);
        };
    }, [playOpts]);

    return (
        <div className="sidebar">
            <div ref={menu} className="menu-bar">
                <div>
                    <button
                        className="button menu-btn"
                        onClick={() => handleClick('home', navigate)}>
                        <img
                            src={UserDefault}
                            style={{
                                width: '60px',
                                height: '60px',
                                padding: '2px'
                            }} />
                        <h3>Home</h3>
                    </button>
                    <button ref={play}
                        className="button menu-btn play"
                        onClick={() => handleClick('play', navigate)}>
                        <img
                            src={PlayImage}
                            style={{
                                width: '60px',
                                height: '60px',
                                padding: '2px'
                            }} />
                        <h3>Play</h3>
                    </button>
                    {!user && (
                        <>
                            <button
                                className="button menu-btn sign-up"
                                onClick={() => handleClick('signup', navigate)}>
                                <h3>Sign Up</h3>
                            </button>
                            <button
                                className="button menu-btn login"
                                onClick={() => handleClick('login', navigate)}>
                                <h3>Login</h3>
                            </button>
                        </>
                    )}
                </div>
                <div>
                    <button
                        className="button menu-btn settings"
                        onClick={() => handleClick('settings', navigate)}>
                        <img
                            src={SettingsIcon}
                            style={{
                                width: '60px',
                                height: '60px',
                                padding: '2px'
                            }} />
                        <h3>Settings</h3>
                    </button>
                    <button
                        className="button menu-btn help"
                        onClick={() => handleClick('help', navigate)}>
                        <img
                            src={HelpIcon}
                            style={{
                                width: '60px',
                                height: '60px',
                                padding: '2px'
                            }} />
                        <h3>Help</h3>
                    </button>
                </div>
            </div>

            {playOpts && (
                <div className="menu-bar" ref={playMenu} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'start' }}>
                    <button
                        className="button menu-btn"
                        onClick={() => handleClick('play-noCPU', navigate)}>
                        <img
                            src={PlayImage}
                            style={{
                                width: '60px',
                                height: '60px',
                                padding: '2px'
                            }} />
                        <h3>Play Online</h3>
                    </button>
                    <button
                        className="button menu-btn"
                        onClick={() => handleClick('play-CPU', navigate)}>
                        <h3>AI</h3>
                        <h3>Play with CPU</h3>
                    </button>
                </div>
            )}
        </div>

    )
}

export default SideBar;