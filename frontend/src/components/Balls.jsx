<<<<<<< HEAD
import "../styles/Game.css";
import {useRef, useEffect} from "react";
=======
import {useRef, useEffect} from "react";
import "../styles/Game.css";
>>>>>>> efa72369a7cb309458e0731b7ff74db918251236

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
    <svg
      ref={ballRef}
      className={`marble ${isSelected ? "selected" : ""}`}
      onClick={() => onBallClick(value)}
    >
      <circle cx="4" cy="4" r="4" fill="black" />
      {value}
    </svg>
  );
}

function GenerateBalls({ balls, onBallClick, savedBalls }) {
    const isSelected = savedBalls ? (ball) => savedBalls.includes(ball) : () => false;
    return balls.map((ball, i) => (
      <Ball key={i} value={ball} onBallClick={onBallClick} isSelected={isSelected(ball)} />
    ));
  }

export {GenerateBalls, Ball};