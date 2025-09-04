import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/SideBar.css";
import { handleClick, fetching } from "./utilities";
import PlayImage from "../assets/Play.svg";
import UserDefault from "../assets/User default.svg";
import SettingsIcon from "../assets/Settings.svg";
import HelpIcon from "../assets/Help.svg";
// import { set } from "firebase/database";


function SideBar() {
    const [playOpts, setPlayOpts] = useState(false);
    const [user, setUser] = useState(() => {
        const stored = localStorage.getItem('user');
        return stored ? JSON.parse(stored) : null;
    })
    const navigate = useNavigate();
    const play = useRef(null);
    const playMenu = useRef(null);
    const menu = useRef(null);
    const token = localStorage.getItem('sessionId') || null;

    useEffect(() => {
        async function loadUsers() {
            try {
                const users = await fetching('loaduser');
                console.log('Users:', users);
                localStorage.setItem('user', JSON.stringify(users));
                setUser(users);

            } catch (error) {
                console.error('Error loading users:', error.message);
                localStorage.removeItem('sessionId');
                localStorage.removeItem('user');
                setUser(null);
            }
        }
        loadUsers();
    }, [token]);

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