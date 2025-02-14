import {useState, useRef, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import "../styles/SideBar.css";
import { handleClick } from "./utilities";

function SideBar() {
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
        <div ref={menu} className="menu-bar" style={{justifyItems: 'space-around'}}>
            <div>
                <button className="button menu-btn" style={{ height: '55px' }} onClick={() => handleClick('home', navigate)}>
                    Wythoff's Game Online
                </button>
                <button ref={play} className="button menu-btn play" onClick={() => handleClick('play', navigate)}>Play</button>
                <button className="button menu-btn sign-up">Sign Up</button>
                <button className="button menu-btn login">Login</button>
                <button className="button menu-btn settings">Settings</button>
                <button className="button menu-btn help">Help</button>
            </div>
        </div>
        {playOpts && (
            <div className="menu-bar" ref={playMenu} style={{left: '140px', display:'block'}}>
                <button className="button menu-btn" onClick={() => handleClick('play-noCPU', navigate)}>Play</button>
                <button className="button menu-btn" onClick={() => handleClick('play-CPU', navigate)}>Play with CPU</button>
            </div>
            )}
        </>
    )
}

export default SideBar;