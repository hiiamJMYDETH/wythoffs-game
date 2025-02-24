import Background from "../components/Background";
import "../styles/page.css";

function SignUpPage() {
    return (
        <div className="page">
            {/* <Background /> */}
            <div className="center">
                <h1>Wythoff's Game</h1>
                <div className="box" style={{ justifyItems: 'center', display: 'grid', position: 'relative', zIndex: '0' }}>
                    <h1>Sign Up</h1>
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
                        type="text" placeholder="Username" />
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
                        type="text" placeholder="Email" />
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
                        type="text" placeholder="Password" />
                    <br />
                    <button className="button">Sign Up</button>
                </div>
                <p style={{ position: 'relative', bottom: '0' }}>@2025 Wythoff's Game Online</p>
            </div>
        </div>
    )
}

export default SignUpPage;