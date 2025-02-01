import React, { useState } from 'react';
import "./Game.css";


function Ball({ value, onBallClick, isSelected }) {
  return (
    <svg
      data-ball-id={value}
      className={`marble ${isSelected ? 'selected' : ''}`}
      onClick={() => onBallClick(value)}
    >
      <circle cx="8" cy="8" r="8" fill="black" />
      {value}
    </svg>
  );
}


function GenerateBalls({ balls, onBallClick, savedBalls }) {
  return balls.map((ball, i) => (
    <Ball key={i} value={ball} onBallClick={onBallClick} isSelected={savedBalls.includes(ball)} />
  ));
}

function calculateWinner(leftBalls, rightBalls, isUser) {
  if (leftBalls === 0 && rightBalls === 0) {
    return isUser ? "Computer" : "You";
  }
  return null
}


function Board({ leftBalls, rightBalls, onBallClick, savedBalls }) {
  return (
    <div className="board">
      <div className="half-board">
        <GenerateBalls balls={leftBalls} onBallClick={onBallClick} savedBalls={savedBalls} />
      </div>
      <div className="half-board">
        <GenerateBalls balls={rightBalls} onBallClick={onBallClick} savedBalls={savedBalls} />
      </div>
    </div>
  );
}

function Game() {
  const generateInitialState = () => {
    const totalBalls = Math.floor(Math.random() * (20 - 10) + 10);
    return [
      {
        left: Array.from({ length: Math.floor(totalBalls / 2) }, (_, i) => i),
        right: Array.from({ length: totalBalls - Math.floor(totalBalls / 2) }, (_, i) => i + Math.floor(totalBalls / 2)),
      },
    ];
  };

  const [history, setHistory] = useState(generateInitialState());
  const [savedBalls, setSavedBalls] = useState([]);
  const [currentMove, setCurrentMove] = useState(0);
  const [gameOver, setGameOver] = useState(false);  
  const userIsNext = currentMove % 2 === 0;

  const leftBalls = history[currentMove].left;
  const rightBalls = history[currentMove].right;

  function handleBallClick(ball) {
    setSavedBalls(prev =>
      prev.includes(ball) ? prev.filter(b => b !== ball) : [...prev, ball]
    );
  }

  function handleConfirm() {
    if (savedBalls.length === 0) return; 


    const lastState = history[currentMove];
    const newLeftBalls = lastState.left.filter(b => !savedBalls.includes(b));
    const newRightBalls = lastState.right.filter(b => !savedBalls.includes(b));

    const leftDiff = lastState.left.length - newLeftBalls.length;
    const rightDiff = lastState.right.length - newRightBalls.length;

    if ((leftDiff !== rightDiff) && (leftDiff > 0) && (rightDiff > 0)) {
      alert('Invalid move: Unequal removal from both sides');
      return; 
    }


    setHistory(prevHistory => [
      ...prevHistory.slice(0, currentMove + 1),
      { left: newLeftBalls, right: newRightBalls },
    ]);
    setSavedBalls([]); 
    setCurrentMove(prevMove => prevMove + 1); 


    if (newLeftBalls.length === 0 && newRightBalls.length === 0) {
      setGameOver(true);  
    }
  }

  let status;
  const winner = calculateWinner(leftBalls.length, rightBalls.length, userIsNext);
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (userIsNext ? "you" : "computer");
  }



  function handleRestart() {
    setHistory(generateInitialState());
    setSavedBalls([]);
    setCurrentMove(0);
    setGameOver(false); 
  }
  return (
    <div className="game" style={{backgroundColor: '#fffbe2'}}>
      <div className="status">
        {currentMove === history.length ? <h2>Game Over</h2> : <p>Move {currentMove + 1}</p>}
        <p>{status}</p>
      </div>
      <Board leftBalls={leftBalls} rightBalls={rightBalls} onBallClick={handleBallClick} savedBalls={savedBalls} />
      <button className="button" onClick={handleConfirm}>Confirm Move</button>
      {gameOver && (
        <button className="button" onClick={handleRestart}>Restart Game</button>
      )}
    </div>
  );
}

export default Game;
