import {useState} from 'react';
import './Game.css';

function Ball({ value, onBallClick }) {
  return (
    <svg
      className="Marble"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      onClick={onBallClick} // Click event directly on the SVG
    >
      <circle cx="8" cy="8" r="8" fill="#000000" />
      <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" fill="white">
        {value}
      </text>
    </svg>
  );
}

function GenerateBalls({ balls, handleClick }) {
  return balls.map((ball, i) => (
    <Ball key={i} value={ball} onBallClick={() => handleClick(ball)} />
  ));
}

function Board({ leftBalls, rightBalls, onBallClick }) {
  return (
    <div className="Board">
      <div className="half-board">
        <GenerateBalls balls={leftBalls} handleClick={onBallClick} />
      </div>
      <div className="half-board">
        <GenerateBalls balls={rightBalls} handleClick={onBallClick} />
      </div>
    </div>
  );
}

function Game() {
  const totalBalls = Math.floor(Math.random() * (20 - 10) + 10);
  const savedBalls = useState(null);
  
  const [leftBalls, setLeftBalls] = useState(
    Array.from({ length: Math.floor(totalBalls / 2) }, (_, i) => i)
  );
  const [rightBalls, setRightBalls] = useState(
    Array.from({ length: totalBalls - Math.floor(totalBalls / 2) }, (_, i) => i + Math.floor(totalBalls / 2))
  );

  function handleBallClick(ball) {
    savedBalls.push(ball);
    if (leftBalls.includes(ball)) {
      setLeftBalls(leftBalls.filter((b) => b !== ball));
    } else {
      setRightBalls(rightBalls.filter((b) => b !== ball));
    }
  }

  function handleConfirm() {
    console.log(savedBalls);
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board leftBalls={leftBalls} rightBalls={rightBalls} onBallClick={handleBallClick} />
        <button className="button" onClick={handleConfirm}>Confirm</button>
      </div>
    </div>
  );
}

export default Game;
