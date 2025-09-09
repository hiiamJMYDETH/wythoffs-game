import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetching } from "../components/utilities.jsx";
import "../styles/page.css";
import { auth } from "../config/firebase.js";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";

async function handleSignUp(navigate, email, username, password, confirmPass, setMissingInfo, setWrongInfo) {
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

    const response = await fetching('registeracc', 'POST', { type: 'signup', userId: uid, username, email: email });
    if (response.status != true) {
        setWrongInfo(true);
        return;
    }
    localStorage.setItem('userId', uid);
    navigate('/');

}

async function handleLogin(navigate, email, password, setMissingInfo, setWrongInfo) {
    if (email === '' || password === '') {
        console.log("Missing information");
        setMissingInfo(true);
        return;
    }
    setWrongInfo(false);
    setMissingInfo(false);

    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const { uid } = userCredential.user;

    const response = await fetching('registeracc', 'POST', { type: 'login', userId: uid, email: email });
    if (response.status != true) {
        setWrongInfo(true);
        return;
    }
    localStorage.setItem('userId', uid);
    navigate('/');
}

function RegisterPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [wrongInfo, setWrongInfo] = useState(false);
    const [missingInfo, setMissingInfo] = useState(false);
    const [registerNew, setRegisterNew] = useState(false);

    const handleLoginClick = () => {
        handleLogin(navigate, email, password, setMissingInfo, setWrongInfo);
    }

    const handleSignUpClick = () => {
        handleSignUp(navigate, email, username, password, confirmPass, setMissingInfo, setWrongInfo);
    }

    return (
        <div className="page">
            <div className="center">
                <h1>Wythoff's Game</h1>
                {registerNew ? (
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
                                    handleSignUpClick();
                                }
                            }} />
                        <br />
                        <button className="button" onClick={handleSignUpClick}>Sign Up</button>
                        <button className="button"
                            style={{
                                border: 'none',
                                width: '100%',
                                backgroundColor: 'transparent'
                            }}
                            onClick={() => setRegisterNew(false)}
                        >Already have an account</button>
                    </div>
                ) : (
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
                                    handleLoginClick();
                                }
                            }} />
                        <br />
                        <button className="button" onClick={handleLoginClick}>Login</button>
                        <button className="button"
                            style={{
                                border: 'none',
                                width: '100%',
                                backgroundColor: 'transparent'
                            }}
                            onClick={() => setRegisterNew(true)}
                        >Need a account</button>
                    </div>
                )}
                <p style={{ position: 'relative', bottom: '0' }}>@2025 Wythoff's Game Online</p>
            </div>
        </div>
    )
}

export default RegisterPage;