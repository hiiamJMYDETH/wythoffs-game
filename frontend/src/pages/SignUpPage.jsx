import { useState } from "react";
import { fetching } from "../components/utilities";
import { useNavigate } from "react-router-dom";
import "../styles/page.css";
import { auth } from "../config/firebase.js";
import { createUserWithEmailAndPassword } from "firebase/auth";

function SignUpPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [wrongInfo, setWrongInfo] = useState(false);
    const [missingInfo, setMissingInfo] = useState(false);

    async function handleSignUp() {
        if (confirmPass != password) {
            console.log("password doesn't match");
            setWrongInfo(true);
            return;
        }
        if (email === '' || username === '' || password === '' || confirmPass === '') {
            console.log("Missing information");
            setMissingInfo(true);
            return;
        }
        setWrongInfo(false);
        setMissingInfo(false);

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const { uid } = userCredential.user;

        const response = await fetching('signup', 'POST', { userId: uid, username, email: email });
        if (response.status != "success") {
            setWrongInfo(true);
            return;
        }
        localStorage.setItem('userId', uid);
        navigate('/');

    }
    return (
        <div className="page">
            <div className="center">
                <h1>Wythoff's Game</h1>
                <div className="box" style={{ justifyItems: 'center', display: 'grid', position: 'relative', zIndex: '0' }}>
                    <h1>Sign Up</h1>
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
                        placeholder="Username"
                        value={username}
                        onChange={(e) => {
                            setUsername(e.target.value);
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
                        }} />
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
                        placeholder="Confirm password"
                        value={confirmPass}
                        onChange={(e) => {
                            setConfirmPass(e.target.value);
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                handleSignUp();
                            }
                        }} />
                    <br />
                    <button className="button" onClick={handleSignUp}>Sign Up</button>
                </div>
                <p style={{ position: 'relative', bottom: '0' }}>@2025 Wythoff's Game Online</p>
            </div>
        </div>
    )
}

export default SignUpPage;