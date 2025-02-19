import { Routes, Route, useLocation } from "react-router-dom";
import { useMobileDetect } from "./components/utilities.jsx";
import HomePage from "./pages/HomePage.jsx";
import HomePageM from "./pages/mobile/HomePage.jsx";


function App() {
  const isMobile = useMobileDetect();
  const location = useLocation();


  return (
    <>
      {isMobile ? (
        <Routes>
          <Route path="/" element={<HomePageM />} />
        </Routes>
      ) : (
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      )}
    </>
  )
}

export default App
