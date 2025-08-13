import { useEffect, useState } from "react";

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
  if (id === "login") {
    navigate('/login');
    return;
  }
  if (id === "signup") {
    navigate('/signup');
    return;
  }
  if (id === "help") {
    navigate('/help');
    return;
  }
}

function Counter({ isGameOver, setter, maxSeconds, hasStarted }) {
  if (isGameOver) {
    return (
      <div className="status timer" style={{ display: 'none' }}>
        <p style={{ margin: '0px' }}> Results: </p>
      </div>
    )
  }
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (isGameOver || !hasStarted) {
      setCount(0);
      return;
    }
    const intervalId = setInterval(() => {
      setCount(prev => prev + 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isGameOver, hasStarted]);

  useEffect(() => {
    if (count >= maxSeconds) {
      setter(true);
    }
  }, [count, setter]);

  let min = Math.floor(count / 60);
  let tempSeconds = count - (min * 60);
  let seconds = tempSeconds > 9 ? tempSeconds : '0' + tempSeconds;

  if (isGameOver) {
    return (
      <div className="timer" style={{ fontSize: '35px', justifySelf: 'center' }}>
        <p> Out of time </p>
      </div>
    )
  }

  return (
    <div className="timer" style={{
      justifySelf: 'center',
      fontWeight: 'bold',
      marginRight: '10px'
    }}>
      <p> {min + ":" + seconds} </p>
    </div>
  )
}

async function fetching(req, reqMethod = 'GET', reqData = "Your data here") {
  const apiUrl = import.meta.env.VITE_API_URL || `http://localhost:3000/api`;

  const options = {
    method: reqMethod,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Session ${localStorage.getItem('sessionId') || ''}`
    }
  };

  if ((reqMethod === 'POST' || reqMethod === 'PUT') && reqData !== "Your data here") {
    options.body = JSON.stringify(reqData);
  }

  try {
    const response = await fetch(`${apiUrl}/${req}`, options);

    // Read the body as text once
    const text = await response.text();
    console.log("Raw response:", text);

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText} - ${text}`);
    }

    // Try to parse JSON
    try {
      return JSON.parse(text);
    } catch {
      return text || 'No message received';
    }
  } catch (error) {
    throw new Error(`Fetch error: ${error.message}`);
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



export { useMobileDetect, Counter, handleClick, fetching, LoadingDiv };
