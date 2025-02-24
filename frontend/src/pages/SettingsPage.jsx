import Background from "../components/Background";
import MobileSideBar from "../components/MobileSideBar";
import SideBar from "../components/SideBar";
import { useMobileDetect } from "../components/utilities";
import "../styles/page.css";

function SettingsPage() {
    const isMobile = useMobileDetect();
    let language = "English"
    return (
        <div className="page">
            {/* <Background /> */}
            {isMobile ? (
                <MobileSideBar />
            ) : (
                <SideBar />
            )}
            <div className="center">
                <div className="box" style={{
                    justifyItems: 'center',
                    display: 'grid',
                    position: 'relative',
                    zIndex: '0',
                    border: 'none'
                }}>
                    <h3>Settings</h3>
                    <h3>Guest</h3>
                    <p>You must login to access more features.
                        Also, there's like no features yet.
                    </p>
                    <div style={{ display: 'flex', width: '100%' }}>
                        <p>Langauge</p>
                        <button className="button">{language}</button>
                    </div>
                    <div style={{ display: 'flex', width: '100%' }}>
                        <p>Background</p>
                        <button className="button">White</button>
                    </div>
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
                    <button className="button" style={{ width: '100%', margin:'auto' }} >Change password</button>
                    <button className="button main">Delete account</button>
                </div>
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