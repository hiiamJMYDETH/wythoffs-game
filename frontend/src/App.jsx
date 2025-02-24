import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import HomePage from "./pages/HomePage.jsx";
import PlayPage from "./pages/PlayPage.jsx";
import GamePageCPU from "./pages/GamePageCPU.jsx";
import GamePageOnline from "./pages/GamePageOnline.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import HelpPage from "./pages/HelpPage.jsx";

const usePageTitle = () => {
  const location = useLocation();
  useEffect(() => {
    switch (location.pathname) {
      case '/login':
        document.title = 'Login';
        break;
      case '/signup':
        document.title = 'Signup';
        break;
      case '/play':
        document.title = "Play";
        break;
      case '/play/computer':
      case '/play/online':
        document.title = "Game is in Session";
        break;
      case '/settings':
        document.title = "Settings";
        break;
      case '/help':
        document.title = "Help";
        break;
      default:
        document.title = "Wythoff's Game";
    }
  }, [location]);
}

function App() {
  usePageTitle();
  const location = useLocation();

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/play" element={<PlayPage key={location.search} />} />
        <Route path="/play/computer" element={<GamePageCPU key={location.search} />} />
        <Route path="/play/online" element={<GamePageOnline key={location.search} />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/help" element={<HelpPage />} />
      </Routes>
    </>
  )
}

export default App
