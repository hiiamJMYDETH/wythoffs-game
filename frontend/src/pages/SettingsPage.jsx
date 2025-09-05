import MobileSideBar from "../components/MobileSideBar";
import Player from "../components/Player";
import SideBar from "../components/SideBar";
import { useMobileDetect, LoadingDiv, fetching } from "../components/utilities";
import "../styles/page.css";
import { useState, useEffect } from "react";
import UserDefault from "../assets/User default.svg";

function SettingsPage() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const isMobile = useMobileDetect();
    const [user, setUser] = useState(() => {
        const stored = localStorage.getItem('user');
        return stored ? JSON.parse(stored) : null;
    });
    const userId = user.userId || null;
    const [win, setWin] = useState(0);
    const [loss, setLoss] = useState(0);
    const [oldUsername, setOldUsername] = useState(null);
    const [userObj, setUserObj] = useState(null);
    const [username, setUsername] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [password, setPassword] = useState('');
    var image = UserDefault;
    useEffect(() => {
        async function loadUsers() {
            try {
                setLoading(true);
                const users = await fetching('users');
                if (users) {
                    const matchedUser = users.find(u => u.id === userId);
                    if (matchedUser) {
                        const { username, usr_pwd, win, lose } = matchedUser;
                        setUserObj(matchedUser);
                        setOldUsername(username);
                        setWin(win);
                        setLoss(lose);
                    }
                }
            } catch (error) {
                console.error('Error loading users:', error.message);
                localStorage.removeItem('token');
            } finally {
                setLoading(false);
            }
        }

        if (userId) {
            loadUsers();
        }
    }, [userId]);

    async function handleAlterInfo() {
        const result = await fetching('changeup', 'POST', {userId, oldUsername, newUsername: username, oldPassword, newPassword: password});
        console.log("Bruh");
    }

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
                        {userObj ? (
                            <div style={{ display: 'flex' }}>
                                <img src={image} />
                                <div>
                                    <h2>{oldUsername}</h2>
                                    <p>Win-Loss: {win}-{loss}</p>
                                </div>
                            </div>
                        ) : (<>
                            <h3>Guest</h3>
                            <p>You must login to access more features.
                                Also, there's like no features yet.
                            </p>
                        </>)}
                        {userObj ? (
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
                                    placeholder="New username"
                                    value={username}
                                    onChange={(e) => {
                                        setUsername(e.target.value);
                                    }}
                                />
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
                                    placeholder="Old password"
                                    value={oldPassword}
                                    onChange={(e) => {
                                        setOldPassword(e.target.value);
                                    }}
                                />
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
                                    placeholder="New password"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                    }}
                                />
                                <button className="button" style={{ width: '100%', margin: 'auto' }} onClick={handleAlterInfo}>Change username/password</button>
                                <br />
                                <button className="button main">Delete account</button>
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