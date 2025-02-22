import {useRef, useEffect} from "react";
import "../styles/Game.css";
import MarbleImage from "../assets/Marble.svg";

function Ball({ value, onBallClick, isSelected }) {
  const ballRef = useRef(null);

  useEffect(() => {
    const element = ballRef.current;
    if (!element) return;

    const handleTouch = (event) => {
      event.preventDefault(); 
      onBallClick(value);
    };

    element.addEventListener("touchend", handleTouch, { passive: false });

    return () => {
      element.removeEventListener("touchend", handleTouch);
    };
  }, [onBallClick, value]);

  return (
    <img
      ref={ballRef}
      className={`marble ${isSelected ? "selected" : ""}`}
      onClick={() => onBallClick(value)}
      src={MarbleImage}
      alt="Marble"
    />
  );
}

function GenerateBalls({ balls, onBallClick, savedBalls }) {
    const isSelected = savedBalls ? (ball) => savedBalls.includes(ball) : () => false;
    return balls.map((ball, i) => (
      <Ball key={i} value={ball} onBallClick={onBallClick} isSelected={isSelected(ball)} />
    ));
  }

export {GenerateBalls, Ball};