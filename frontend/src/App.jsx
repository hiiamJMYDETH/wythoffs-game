import { Routes, Route, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import PlayPage from "./pages/PlayPage.jsx";
import GamePageCPU from "./pages/GamePageCPU.jsx";
import GamePageOnline from "./pages/GamePageOnline.jsx";


function App() {
  const location = useLocation();

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/play" element={<PlayPage key={location.search} />} />
        <Route path="/play/computer" element={<GamePageCPU key={location.search} />} />
        <Route path="/play/online" element={<GamePageOnline key={location.search} />} />
      </Routes>
    </>
  )
}

export default App
