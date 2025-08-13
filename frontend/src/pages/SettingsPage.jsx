import Background from "../components/Background";
import MobileSideBar from "../components/MobileSideBar";
import Player from "../components/Player";
import SideBar from "../components/SideBar";
import { useMobileDetect, fetching, LoadingDiv } from "../components/utilities";
import "../styles/page.css";
import { useState, useEffect } from "react";

function SettingsPage() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const isMobile = useMobileDetect();
    const sessionId = localStorage.getItem('sessionId') || null;
    const user = localStorage.getItem('user');
    const userObj = user ? JSON.parse(user) : null;
    console.log("User: ", userObj);
    
    const fetchSettings = async () => {
        try {
            setLoading(true);
            setError(null);
            const sessionId = localStorage.getItem('sessionId');

            if (!sessionId) {
                setError("Please log in to view other features");
                return;
            }

        } catch (error) {
            console.error("Failed to fetch users");
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchSettings();
    }, []);
    let language = "English"
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
                        {userObj ? (<>
                            <Player name={userObj.name} />
                        </>) : (<>
                            <h3>Guest</h3>
                            <p>You must login to access more features.
                                Also, there's like no features yet.
                            </p>
                        </>)}
                        <div style={{ display: 'flex', width: '100%' }}>
                            <p>Langauge</p>
                            <button className="button">{language}</button>
                        </div>
                        <div style={{ display: 'flex', width: '100%' }}>
                            <p>Background</p>
                            <button className="button">White</button>
                        </div>
                        {sessionId ? (
                            <>
                                <input
                                    type="text"
                                    style={{
                                        borderBottom: '1px solid black',
                                        borderTop: 'none',
                                        borderLeft: 'none',
                                        borderRight: 'none',
                                        width: '100%',
                                        fontSize: 'large',
                                        margin: '5px'
                                    }}
                                    placeholder="Old username" />
                                <input
                                    type="text"
                                    style={{
                                        borderBottom: '1px solid black',
                                        borderTop: 'none',
                                        borderLeft: 'none',
                                        borderRight: 'none',
                                        width: '100%',
                                        fontSize: 'large',
                                        margin: '5px'
                                    }}
                                    placeholder="New username" />
                                <button className="button" style={{ width: '100%' }} > Change username</button>
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
                                <button className="button main">Delete account</button>
                            </>
                        ) : (
                            <>
                                <br />
                                <button className="button main" style={{minHeight: '100px'}}>Sign Up</button>
                                <br />
                                <button className="button main" style={{minHeight: '100px'}}>Login</button>
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