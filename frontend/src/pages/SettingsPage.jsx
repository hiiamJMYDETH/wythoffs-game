import MobileSideBar from "../components/MobileSideBar";
import SideBar from "../components/SideBar";
import { useMobileDetect, fetching, LoadingDiv } from "../components/utilities";
import Player from "../components/Player";
import "../styles/page.css";
import { useState, useEffect } from "react";

function SettingsPage() {
    const [loading, setLoading] = useState(false);
    const user = localStorage.getItem('user') || null;
    const userId = user.userId || null;
    const [error, setError] = useState(null);
    const isMobile = useMobileDetect();
    console.log("User id: ", userId);

    return (
        <div className="page">
            {isMobile ? (
                <MobileSideBar />
            ) : (
                <SideBar />
            )}
            <div className="center">
                {loading ? <LoadingDiv /> : (
                    <div className="box" style={{
                        justifyItems: 'center',
                        display: 'grid',
                        position: 'relative',
                        zIndex: '0',
                        border: 'none',
                        maxHeight: '100%',
                        offsetY: 'auto'
                    }}>
                        <h3>Settings</h3>
                        {user ? (<>
                            <Player name={userId} />
                        </>) : (<>
                            <h3>Guest</h3>
                            <p>You must login to access more features.
                                Also, there's like no features yet.
                            </p>
                        </>)}
                        {user ? (
                            <>
                                <input
                                    type="password"
                                    style={{
                                        borderBottom: '1px solid black',
                                        borderTop: 'none',
                                        borderLeft: 'none',
                                        borderRight: 'none',
                                        width: '100%',
                                        fontSize: 'large',
                                        margin: '5px'
                                    }}
                                    placeholder="Old password" />
                                <input type="password"
                                    style={{
                                        borderBottom: '1px solid black',
                                        borderTop: 'none',
                                        borderLeft: 'none',
                                        borderRight: 'none',
                                        width: '100%',
                                        fontSize: 'large',
                                        margin: '5px'
                                    }}
                                    placeholder="New password" />
                                <button className="button" style={{ width: '100%', margin: 'auto' }} >Change password</button>
                                <br />
                                <button className="button main">Sign out</button>
                            </>
                        ) : (
                            <>
                                <br />
                                <button className="button main" style={{ minHeight: '100px' }}>Sign Up</button>
                                <br />
                                <button className="button main" style={{ minHeight: '100px' }}>Login</button>
                            </>
                        )}
                    </div>
                )}
                {isMobile ? (
                    <p style={{ position: 'relative', bottom: '0' }}>@2025 Wythoff's Game Online</p>
                ) : (
                    <p style={{ position: 'relative', bottom: '0', justifyContent: 'center' }}>@2025 Wythoff's Game Online</p>
                )}
            </div>
        </div >
    )
}

export default SettingsPage;