import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/SideBar.css";
import { handleClick } from "./utilities";
import PlayImage from "../assets/Play.svg";
import UserDefault from "../assets/User default.svg";
import SettingsIcon from "../assets/Settings.svg";
import HelpIcon from "../assets/Help.svg";
import MarbleImage from "../assets/Marble.svg";


function MobileSideBar() {
    const [sideBarOn, setSideBar] = useState(false);
    const [playOpts, setPlayOpts] = useState(false);
    const navigate = useNavigate();
    const play = useRef(null);
    const playMenu = useRef(null);
    const menu = useRef(null);

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

        playEl.addEventListener("touchstart", showMenu);
        playEl.addEventListener("touchend", hideMenu);

        if (playMenuEl) {
            playMenuEl.addEventListener("touchstart", showMenu);
            playMenuEl.addEventListener("touchend", hideMenu)
        }

        return () => {
            playEl.addEventListener("touchstart", showMenu);
            playEl.addEventListener("touchend", hideMenu);
        };
    }, [playOpts]);

    return (
        <>
            {
                sideBarOn ? (
                    <div className="sidebar" >
                        <div ref={menu} className="menu-bar">
                            <button
                                className="button menu-btn close"
                                onClick={() => setSideBar(prev => !prev)}>
                                <h3>X</h3>
                            </button>
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
                        <div className="menu-bar" ref={playMenu} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'start' }}>
                            <button
                                className="button menu-btn"
                                onClick={() => handleClick('play-noCPU', navigate)}
                                style={{
                                    margin: '5px'
                                }}>
                                <h3>Play Online</h3>
                            </button>
                            <button
                                className="button menu-btn"
                                onClick={() => handleClick('play-CPU', navigate)}
                                style={{
                                    margin: '5px'
                                }}>
                                <h3>Play with CPU</h3>
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="sidebar mobile">
                        <button className="button expand"
                            onClick={() => setSideBar(prev => !prev)}
                            style={{
                                background: 'transparent',
                                border: 'none'
                            }}>
                            =</button>
                        <button className="button "
                            onClick={() => handleClick('home', navigate)}
                            style={{
                                background: 'transparent',
                                border: 'none'
                            }}>
                            <img
                                src={MarbleImage}
                                style={{
                                    width: '40px',
                                    height: '40px'
                                }} />
                        </button>
                        <button className="button sign-up"
                            onClick={() => handleClick('signup', navigate)}
                            style={{
                                background: 'transparent',
                                border: 'none'
                            }}>Sign Up</button>
                        <button className="button login"
                            onClick={() => handleClick('login', navigate)}
                            style={{
                                background: 'transparent',
                                border: 'none'
                            }}>Login</button>
                    </div>
                )
            }
        </>

    )
}

export default MobileSideBar;