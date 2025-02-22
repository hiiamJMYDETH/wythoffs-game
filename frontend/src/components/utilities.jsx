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
}

function Counter({isGameOver, setter, maxSeconds, hasStarted}) {
  if (isGameOver) {
    return (
      <div className="status timer" style={{display:'none'}}>
      <p style={{margin:'0px'}}> Results: </p>
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
      <div className="timer" style={{fontSize: '35px', justifySelf:'center'}}>
      <p> Out of time </p>
      </div>
    )
  }

  return (
    <div className="timer" style={{
      justifySelf:'center',
      fontWeight: 'bold',
      marginRight:'10px'
    }}>
    <p> {min + ":" + seconds} </p>
    </div>
  )
}

async function fetching(req, reqMethod = 'GET', reqData = "Your data here") {  
  let apiUrl = import.meta.env.VITE_API_URL || `http://localhost:3000/api`;


  const options = {
    method: reqMethod,  
    headers: {
      'Content-Type': 'application/json',  
    },
  };

  if (reqMethod === 'POST' || reqMethod === 'PUT') {
    options.body = JSON.stringify({ data: `${reqData}` });  
  }

  try {
    const response = await fetch(`${apiUrl}/${req}`, options);  

    if (response.ok) {
      const data = await response.json();
      return data.message || 'No message received'; 
    } else {
      return `API request failed: ${response.status} ${response.statusText}`;
    }
  } catch (error) {
    return `Fetch error: ${error.message}`;
  }
}

  

  export {useMobileDetect, Counter, handleClick, fetching};
