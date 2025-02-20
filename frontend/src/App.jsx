import { Routes, Route, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
<<<<<<< HEAD
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
=======
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
>>>>>>> efa72369a7cb309458e0731b7ff74db918251236
