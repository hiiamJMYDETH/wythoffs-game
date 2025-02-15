import { Routes, Route, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import GamePage from "./pages/GamePage.jsx";

function App() {
    const location = useLocation();
    return (
        <>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/play" element={<GamePage key={location.search}/>} />
                </Routes>
        </>
    )
}

export default App;