import SideBar from "../components/SideBar.jsx";

function HomePage() {
    return (
        <div className="page">
            {isMobile ? (
                <>
                    <MobileSideBar />
                    <div className="center">
                        <h1>Play Wythoff's Game</h1>
                    </div>
                </>
            ) : (
                <>
                    <SideBar />
                    <div className="center">
                        <h1>Play to Wythoff's Game</h1>
                    </div>
                </>
            )}
        </div>
    )
}

export default HomePage;