import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/SideBar.css";
import { handleClick } from "./utilities";


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
                            <button className="button menu-btn close" onClick={() => setSideBar(prev => !prev)}>Close</button>
                            <button className="button menu-btn home" onClick={() => handleClick('home', navigate)}>Home</button>
                            <button ref={play} className="button menu-btn play" onClick={() => handleClick('play', navigate)}>Play</button>
                            <button className="button menu-btn sign-up">Sign Up</button>
                            <button className="button menu-btn login">Login</button>
                            <button className="button menu-btn settings">Settings</button>
                            <button className="button menu-btn help">Help</button>
                        </div><div className="menu-bar" ref={playMenu} style={{ display: 'flex', flexDirection: 'column' }}>
                            <button className="button menu-btn" onClick={() => handleClick('play-noCPU', navigate)}>Play</button>
                            <button className="button menu-btn" onClick={() => handleClick('play-CPU', navigate)}>Play with CPU</button>
                        </div>
                    </div>
                ) : (
                    <div className="sidebar mobile">
                        <button className="button menu-btn expand" onClick={() => setSideBar(prev => !prev)}>=</button>
                        <button className="button menu-btn" onClick={() => handleClick('home', navigate)}>
                            Wythoff's Game Online
                        </button>
                        <button className="button menu-btn sign-up">Sign Up</button>
                        <button className="button menu-btn login">Login</button>
                    </div>
                )
            }
        </>

    )
}

export default MobileSideBar;