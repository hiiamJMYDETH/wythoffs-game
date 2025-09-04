import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetching } from "../components/utilities";
import "../styles/page.css";

function LoginPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [wrongInfo, setWrongInfo] = useState(false);
    const [missingInfo, setMissingInfo] = useState(false);
    async function handleLogin() {
        if (email === '' || password === '') {
            console.log("Missing information");
            setMissingInfo(true);
            return;
        }
        setWrongInfo(false);
        setMissingInfo(false);
        const response = await fetching('login', 'POST', { username: email, email: email, password: password });
        if (response.message && response.message === 'Login successful') {
            localStorage.setItem("sessionId", response.sessionId);
            navigate('/');
        }
        else {
            setWrongInfo(true);
        }
    }
    return (
        <div className="page">
            <div className="center">
                <h1>Wythoff's Game</h1>
                <div className="box" style={{ justifyItems: 'center', display: 'grid', position: 'relative', zIndex: '0' }}>
                    <h1>Login</h1>
                    {wrongInfo && <>
                        <p style={{ color: 'red' }}>*Incorrect user information</p>
                    </>}
                    {missingInfo && <>
                        <p style={{ color: 'red' }}>*Missing user information</p>
                    </>}
                    <input
                        style={{
                            borderBottom: '1px solid black',
                            borderTop: 'none',
                            borderLeft: 'none',
                            borderRight: 'none',
                            width: '100%',
                            fontSize: 'large',
                            margin: '5px'
                        }}
                        type="text"
                        placeholder="Email/Username"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                        }} />
                    <br />
                    <input
                        style={{
                            borderBottom: '1px solid black',
                            borderTop: 'none',
                            borderLeft: 'none',
                            borderRight: 'none',
                            width: '100%',
                            fontSize: 'large',
                            margin: '5px'
                        }}
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                handleLogin();
                            }
                        }} />
                    <br />
                    <button className="button" onClick={handleLogin}>Login</button>
                </div>
                <p style={{ position: 'relative', bottom: '0' }}>@2025 Wythoff's Game Online</p>
            </div>
        </div>
    )
}

export default LoginPage;