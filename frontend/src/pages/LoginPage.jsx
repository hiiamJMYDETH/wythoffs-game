import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetching } from "../components/utilities";
import "../styles/page.css";
import { auth } from "../config/firebase.js";
import { signInWithEmailAndPassword } from "firebase/auth";

function LoginPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
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

        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const { uid } = userCredential.user;

        const response = await fetching('login', 'POST', { userId: uid, email: email });
        if (response.status != "success") {
            setWrongInfo(true);
            return;
        }
        localStorage.setItem('userId', uid);
        navigate('/');
        // try {
        //     console.log("HTTP status:", response.status, response.ok);
        //     if (!response.ok) {
        //         setWrongInfo(true);
        //         throw new Error("Login failed");
        //     }
        //     const data = response.json();
        //     console.log("Login successful: ", data);
        // }
        // catch (err) {
        //     console.error("Login error caught: ", err);
        // }
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
                        placeholder="Email"
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