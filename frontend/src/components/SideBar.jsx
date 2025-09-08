import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/SideBar.css";
import { handleClick, fetchUser } from "./utilities";
import PlayImage from "../assets/Play.svg";
import UserDefault from "../assets/User default.svg";
import SettingsIcon from "../assets/Settings.svg";
import HelpIcon from "../assets/Help.svg";



function SideBar() {
    const [loading, setLoading] = useState(false);
    const [playOpts, setPlayOpts] = useState(false);
    const [user, setUser] = useState(null);
    const userId = localStorage.getItem('userId') || null;
    const navigate = useNavigate();
    const play = useRef(null);
    const playMenu = useRef(null);
    const menu = useRef(null);

    useEffect(() => {
        async function loadUser() {
            setLoading(true);
            try {
                const data = await fetchUser(userId);
                if (data.user) {
                    setUser(data.user);
                }
            } catch (err) {
                console.error(err);
                setUser(null);
            } finally {
                setLoading(false);
            }
        }
        if (userId) loadUser();
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
        <>
            {loading ? (
                <div>

                </div>
            ) : (
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
                                        className="button menu-btn register"
                                        onClick={() => handleClick('register', navigate)}>
                                        <h3>Register</h3>
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
            )}
        </>

    )
}

export default SideBar;