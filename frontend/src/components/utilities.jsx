import { useEffect, useState } from "react";
import { database } from "../config/firebase.js";
import { ref, set, onValue } from "firebase/database";

function useMobileDetect() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return isMobile;
}

function handleClick(id, navigate) {
  if (id === "home") {
    navigate('/');
    return;
  }
  if (id === "play") {
    navigate('/play');
    return;
  }
  if (id === "play-CPU") {
    navigate('/play/computer');
    return;
  }
  if (id === "play-noCPU") {
    navigate('/play/online');
    return;
  }
  if (id === "settings") {
    navigate('/settings');
    return;
  }
  if (id === "register") {
    navigate('/register');
    return;
  }
  // if (id === "login") {
  //   navigate('/login');
  //   return;
  // }
  // if (id === "signup") {
  //   navigate('/signup');
  //   return;
  // }
  if (id === "help") {
    navigate('/help');
    return;
  }
}

function Counter({ isGameOver, setter, maxSeconds, hasStarted, gameId }) {
  const [startTime, setStartTime] = useState(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (hasStarted && !isGameOver) {
      const timeRef = ref(database, `games/${gameId}/startTime`);
      set(timeRef, Date.now());
    }
  }, [hasStarted, isGameOver, gameId]);

  useEffect(() => {
    const timeRef = ref(database, `games/${gameId}/startTime`);
    return onValue(timeRef, (snapshot) => {
      const value = snapshot.val();
      if (value) setStartTime(value);
    });
  }, [gameId]);

  useEffect(() => {
    if (!startTime || isGameOver) {
      setCount(0);
      return;
    }

    const intervalId = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      setCount(elapsed);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [startTime, isGameOver]);

  useEffect(() => {
    if (count >= maxSeconds) {
      setter(true);
    }
  }, [count, setter, maxSeconds]);

  let min = Math.floor(count / 60);
  let tempSeconds = count - min * 60;
  let seconds = tempSeconds > 9 ? tempSeconds : "0" + tempSeconds;

  if (isGameOver) {
    return (
      <div className="timer"
        style={{
          justifySelf: "center",
          fontWeight: "bold",
          marginRight: "10px",
        }}
      >
        <p>Out of time</p>
      </div>
    );
  }

  return (
    <div
      className="timer"
      style={{
        justifySelf: "center",
        fontWeight: "bold",
        marginRight: "10px",
      }}
    >
      <p>{min + ":" + seconds}</p>
    </div>
  );
}

function WarningToggle() {
  return (
    <div className="box rule-viol">
      <h2>You must pick either any amount from one side of the board or
        equal amounts from both sides of the board.</h2>
    </div>
  )
}

async function fetching(req, reqMethod = 'GET', reqData = "Your data here") {
  const apiUrl =
    import.meta.env.VITE_API_URL ||
    (import.meta.env.DEV ? import.meta.env.LOCAL_API_URL : "/api");


  const options = {
    method: reqMethod,
    credentials: "include",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `User ${localStorage.getItem('userId')} || ''}`
    }
  };

  if ((reqMethod === 'POST' || reqMethod === 'PUT') && reqData !== "Your data here") {
    options.body = JSON.stringify(reqData);
  }

  try {
    const response = await fetch(`${apiUrl}/${req}`, options);

    const text = await response.text();
    console.log("Raw response:", text);

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText} - ${text}`);
    }

    try {
      return JSON.parse(text);
    } catch {
      return text || 'No message received';
    }
  } catch (error) {
    throw new Error(`Fetch error: ${error.message}`);
  }
}

async function fetchUser(userId) {
    const apiUrl =
        import.meta.env.VITE_API_URL ||
        (import.meta.env.DEV ? import.meta.env.LOCAL_API_URL : "/api");

    const options = {
        method: 'GET',
        credentials: "include",
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const url = `${apiUrl}/loaduserid?userId=${encodeURIComponent(userId)}`;
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP error! status ${response.status}`);
        }
        const responseJson = await response.json();
        return responseJson;
    }
    catch (err) {
        console.error("Error loading users: ", err.message);
        localStorage.removeItem('userId');
        return null;
    }
}

function LoadingDiv() {
  return (
    <div style={{
      textAlign: 'center',
      padding: '20px',
      color: '#666'
    }}>
      Loading your settings...
    </div>
  );
}



export { useMobileDetect, Counter, handleClick, fetching, LoadingDiv, WarningToggle, fetchUser };
