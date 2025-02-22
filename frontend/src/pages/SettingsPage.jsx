import MobileSideBar from "../components/MobileSideBar";
import SideBar from "../components/SideBar";
import { useMobileDetect } from "../components/utilities";
import "../styles/page.css";

function SettingsPage() {
    const isMobile = useMobileDetect();
    let language = "English"
    return (
        <div className="page">
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
                    <br />
                    <input type="text" style={{ width: '100%'}} placeholder="Old username" />
                    <input type="text" style={{ width: '100%'}} placeholder="New username" />
                    <button className="button" style={{ width: '100%'}} >Change username</button>
                    <input type="password" style={{ width: '100%'}} placeholder="Old password" />
                    <input type="password" style={{ width: '100%'}} placeholder="New password" />
                    <button className="button" style={{ width: '100%'}} >Change password</button>
                    <br />
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