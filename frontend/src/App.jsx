import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import GamePage from "./pages/GamePage.jsx";

function App() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/game" element={<GamePage />} />
                </Routes>
            </BrowserRouter>
        </>
    )
}

export default App;