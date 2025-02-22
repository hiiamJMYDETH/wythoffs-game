import React, { useEffect, useState, useRef } from 'react';
import Board from "./Board";
import CPUPlay from './CPU';
import Player from "./Player.jsx";
import { Counter, useMobileDetect } from "./utilities.jsx";
import "../styles/Game.css";
import "../styles/page.css";

const generateInitialState = (numberOfBalls) => {
  const half = numberOfBalls / 2;

  let leftCount, rightCount;
  const isLeftLarger = Math.random() < 0.5;
  if (isLeftLarger) {
    leftCount = Math.floor(Math.random() * (numberOfBalls - half) + half);
    rightCount = numberOfBalls - leftCount;
  } else {
    rightCount = Math.floor(Math.random() * (numberOfBalls - half) + half);
    leftCount = numberOfBalls - rightCount;
  }

  return [
    {
      left: Array.from({ length: leftCount }, (_, i) => i),
      right: Array.from({ length: rightCount }, (_, i) => i + leftCount),
    },
  ];
};

function WarningToggle() {
  return (
    <div className="box rule-viol">
      <h2>You must pick either any amount from one side of the board or
        equal amounts from both sides of the board.</h2>
    </div>
  )
}

function calculateWinner(leftBalls, rightBalls, isUser, isCPUPlaying) {
  let opponent = "Other player";
  if (leftBalls === 0 && rightBalls === 0) {
    if (isCPUPlaying) {
      opponent = "Computer";
    }
    return isUser ? opponent : "You";
  }
  return null
}


function Game({ isCPUPlaying }) {
  const isMobile = useMobileDetect();
  const gameInfo = useRef();
  const [numberOfballs, setNumberOfballs] = useState(20);
  const [minutes, setMinutes] = useState(1);
  const [seconds, setSeconds] = useState(0);
  const [maxSeconds, setMaxSeconds] = useState(minutes * 60 + seconds);
  const [history, setHistory] = useState(generateInitialState(numberOfballs));
  const [savedBalls, setSavedBalls] = useState([]);
  const [currentMove, setCurrentMove] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStart, setGameStart] = useState(false);
  const [ruleViolation, setRuleViolation] = useState(false);
  const [gameSettings, setGameSettings] = useState(false);
  const userIsNext = currentMove % 2 === 0;

  // If available, fix this so that the user turn is random. It means
  // that the user must manually be reset every move.
  // const [userIsNext, setUserIsNext] = useState(Math.floor());
  // Also, no need to set the current move after every turn (user can review them in a different section with an account)

  const leftBalls = history[currentMove].left;
  const rightBalls = history[currentMove].right;

  function handleBallClick(ball) {
    if (!gameStart) {
      setGameStart(true);
    }
    if (gameOver || history.length != currentMove + 1 || gameSettings) return;
    setSavedBalls(prev =>
      prev.includes(ball) ? prev.filter(b => b !== ball) : [...prev, ball]
    );
  }


  function handleConfirm() {
    if (savedBalls.length === 0 || gameSettings) return;


    const lastState = history[currentMove];
    const newLeftBalls = lastState.left.filter(b => !savedBalls.includes(b));
    const newRightBalls = lastState.right.filter(b => !savedBalls.includes(b));

    const leftDiff = lastState.left.length - newLeftBalls.length;
    const rightDiff = lastState.right.length - newRightBalls.length;

    if ((leftDiff !== rightDiff) && (leftDiff > 0) && (rightDiff > 0)) {
      setRuleViolation(true);
      setTimeout(() => {
        setRuleViolation(false);
      }, 2000);
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

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  useEffect(() => {
    if (!userIsNext && isCPUPlaying) {
      if (history.length != currentMove + 1) return;
      const ballsToSave = CPUPlay(history[currentMove])
      setSavedBalls(ballsToSave);
      handleConfirm();
    }
  }, [userIsNext, history, currentMove]);

  useEffect(() => {
    if (userIsNext || !isCPUPlaying) return;
    if (savedBalls && savedBalls.length > 0) {
      handleConfirm();
    }
  }, [savedBalls]);

  useEffect(() => {
    if (numberOfballs != null) {
      handleRestart();
    }
  }, [numberOfballs]);

  useEffect(() => {
    if (maxSeconds != null) {
      handleRestart();
    }
  }, [maxSeconds]);

  let status;
  let opponent = isCPUPlaying ? "computer" : "opponent";
  const winner = calculateWinner(leftBalls.length, rightBalls.length, userIsNext, isCPUPlaying);
  if (winner) {
    status = "Winner: " + winner;
  }
  else if (!gameOver) {
    status = "Next player: " + (userIsNext ? "you" : opponent);
  }
  else {
    status = "Game Over";
  }

  const moves = history.map((step, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    }
    else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button className="button" onClick={() => jumpTo(move)}>{description}</button>
      </li>
    )
  });

  useEffect(() => {
    handleRestart();
  }, [isCPUPlaying]);

  const handleGame = () => {
    const totalSeconds = parseInt(minutes) * 60 + parseInt(seconds);
    setNumberOfballs(numberOfballs);
    setMaxSeconds(totalSeconds);
    handleRestart();
  };

  function handleRestart() {
    console.log("total seconds: ", maxSeconds);
    setHistory(generateInitialState(numberOfballs));
    setSavedBalls([]);
    setCurrentMove(0);
    setGameOver(false);
    setGameStart(false);
  }


  return (
    <>
      {isMobile ? (
        <>
          <div className="game">
            {ruleViolation && <WarningToggle />}
            {gameSettings &&
              <div className="center" style={{
                position: 'absolute',
                width: '100%',
                height: '100%'
              }}
                onClick={() => setGameSettings(false)}>
                <div className="box" onClick={(e) => e.stopPropagation()}>
                  <p className="settings-text">Max Number of Balls in Game</p>
                  <div className="slider-container" style={{ display: "flex" }}>
                    <input
                      type="range"
                      min="10"
                      max="20"
                      className="slider"
                      step="2"
                      value={numberOfballs}
                      onChange={(e) => setNumberOfballs(e.target.value)}
                    />
                    <h3 className="settings-text" style={{ margin: "0 auto" }}>
                      {numberOfballs}
                    </h3>
                  </div>
                  <br />
                  <div className="time-container" style={{ display: "flex", justifyContent: 'center' }}>
                    <input 
                      type="number" 
                      className="minutes" 
                      min="1" 
                      max="60" 
                      defaultValue={minutes}
                      onChange={(e) => setMinutes(Number(e.target.value))}
                    />
                    <h3 className="settings-text">:</h3>
                    <input 
                      type="number" 
                      className="seconds" 
                      min="0" 
                      max="59" 
                      defaultValue={seconds}
                      onChange={(e) => setSeconds(Number(e.target.value))}
                    />
                  </div>
                  <br />
                  <button className="button" onClick={handleGame}>Restart Game</button>
                </div>
              </div>
            }
            <br />
            <Board leftBalls={leftBalls} rightBalls={rightBalls} onBallClick={handleBallClick} savedBalls={savedBalls} />
            <br />
            <div className="status" ref={gameInfo}>
              <div style={{ display: 'flex' }}>
                <Counter isGameOver={gameOver} setter={setGameOver} maxSeconds={maxSeconds} hasStarted={gameStart} />
                <p style={{ fontWeight: 'bold' }}>{status}</p>
              </div>
              <div style={{ display: 'flex' }}>
                {!gameOver && (<button className="button main" onClick={handleConfirm} style={{ minHeight: '50px' }}>Confirm Move</button>)}
                {
                  gameOver && (
                    <button className="button main" onClick={handleRestart} style={{ minHeight: '50px' }}>Restart Game</button>
                  )
                }
                <button className="button" onClick={() => setGameSettings(!gameSettings)} style={{ minWidth: '100px' }}>Game Settings</button>
              </div>
              <div style={{ width: '200px', height: '100px', overflowY: 'auto' }}>
                <ol>{moves}</ol>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', width: '100%', backgroundColor: 'transparent' }}>
                <Player name={"You"} />
                <Player name={opponent} />
              </div >
            </div>
          </div>
        </>
      ) : (
        <div style={{ display: 'flex' }}>
          <div className="game">
            {ruleViolation && <WarningToggle />
            }
            {gameSettings &&
              <div className="center" style={{
                position: 'absolute',
                width: '100%',
                height: '100%'
              }}
                onClick={() => setGameSettings(false)}>
                <div className="box" onClick={(e) => e.stopPropagation()}>
                  <p className="settings-text">Max Number of Balls in Game</p>
                  <div className="slider-container" style={{ display: "flex" }}>
                    <input
                      type="range"
                      min="10"
                      max="20"
                      className="slider"
                      step="2"
                      value={numberOfballs}
                      onChange={(e) => setNumberOfballs(e.target.value)}
                    />
                    <h3 className="settings-text" style={{ margin: "0 auto" }}>
                      {numberOfballs}
                    </h3>
                  </div>
                  <br />
                  <div className="time-container" style={{ display: "flex", justifyContent: 'center' }}>
                    <input 
                      type="number" 
                      className="minutes" 
                      min="1" 
                      max="60" 
                      defaultValue={minutes}
                      onChange={(e) => setMinutes(Number(e.target.value))}
                    />
                    <h3 className="settings-text">:</h3>
                    <input 
                      type="number" 
                      className="seconds" 
                      min="0" 
                      max="59" 
                      defaultValue={seconds}
                      onChange={(e) => setSeconds(Number(e.target.value))}
                    />
                  </div>
                  <br />
                  <button className="button" onClick={handleGame}>Restart Game</button>
                </div>
              </div>
            }
            <Board leftBalls={leftBalls} rightBalls={rightBalls} onBallClick={handleBallClick} savedBalls={savedBalls} />
            <div className="status" style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', width: '100%', backgroundColor: 'transparent' }}>
              <Player name={"You"} />
              <Player name={opponent} />
            </div >
          </div >
          <div className="status" ref={gameInfo}>
            <div style={{ display: 'flex' }}>
              <Counter isGameOver={gameOver} setter={setGameOver} maxSeconds={maxSeconds} hasStarted={gameStart} />
              <p style={{ fontWeight: 'bold' }}>{status}</p>
            </div>
            <div style={{ width: '200px', height: '360px', overflowY: 'auto' }}>
              <ol>{moves}</ol>
            </div>
            <div style={{ bottom: '0', margin: '5px', justifyContent: 'center' }}>
              {!gameOver && (<button className="button main" onClick={handleConfirm} style={{ minHeight: '50px' }}>Confirm Move</button>)}
              {
                gameOver && (
                  <button className="button main" onClick={handleRestart} style={{ minHeight: '50px' }}>Restart Game</button>
                )
              }
              <button className="button" onClick={() => setGameSettings(!gameSettings)} style={{ width: '100%', minHeight: '20px' }}>Game Settings</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Game;
