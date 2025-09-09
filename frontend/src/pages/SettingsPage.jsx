import MobileSideBar from "../components/MobileSideBar";
import SideBar from "../components/SideBar";
import { useMobileDetect, LoadingDiv, fetchUser, fetching } from "../components/utilities";
import "../styles/page.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserDefault from "../assets/User default.svg";
import { auth } from "../config/firebase.js";
import { signOut } from "firebase/auth";

function SettingsPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const isMobile = useMobileDetect();
    const userId = localStorage.getItem('userId') || null;
    const [win, setWin] = useState(0);
    const [loss, setLoss] = useState(0);
    const [oldUsername, setOldUsername] = useState(null);
    const [userObj, setUserObj] = useState(null);
    const [username, setUsername] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [password, setPassword] = useState('');
    var image = UserDefault;
    useEffect(() => {
        async function loadUser() {
            setLoading(true);
            try {
                const data = await fetchUser(userId);
                if (data.user) {
                    const user = data.poolUser[0];
                    setUserObj(user);
                    setWin(user.win);
                    setLoss(user.lose);
                    setOldUsername(user.username);
                }
            } catch (err) {
                console.error(err);
                setUserObj(null);
                localStorage.removeItem('userId');
            } finally {
                setLoading(false);
            }
        }
        if (userId) loadUser();
    }, [userId]);

    async function handleAlterInfo() {
        if (!userId) return;
        await fetching('changeup', 'POST', { userId, oldUsername, newUsername: username, oldPassword, newPassword: password });
    }

    async function handleDeleteAcc() {
        if (!userId) return;
        await fetching('deleteacc', 'POST', { userId });
        localStorage.removeItem("userId");
        setUserObj(null);
        setUsername('');
        setOldUsername('');
        setWin(0);
        setLoss(0);

    }

    async function handleLogOut() {
        if (!userId) return;
        signOut(auth).then(() => {
            localStorage.removeItem("userId");
            setUserObj(null);
            setUsername('');
            setOldUsername('');
            setWin(0);
            setLoss(0);
        }).catch((error) => {
            console.error("Error signing out: ", error);
        });

    }

    function handleRegisterButton() {
        navigate('/register');
        return;
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
                                <button className="button" style={{ width: '100%', margin: 'auto' }} onClick={handleDeleteAcc}>Delete account</button>
                                <br />
                                <button className="button main" onClick={handleLogOut}>Log out</button>
                            </>
                        ) : (
                            <>
                                <br />
                                <button className="button main" style={{ minHeight: '100px' }} onClick={handleRegisterButton}>Register an Account</button>
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