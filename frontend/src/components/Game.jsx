import React, { useEffect, useState, useRef } from 'react';
import Board from "./Board";
import CPUPlay from './CPU';
import { Counter, useMobileDetect } from "./utilities.jsx";
import "../styles/Game.css";

function setMaxHeight(leftBalls, rightBalls) {
  return '325';
}

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


function Game({ numberOfballs, maxSeconds, isCPUPlaying }) {
  const isMobile = useMobileDetect();
  const gameInfo = useRef();
  const [history, setHistory] = useState(generateInitialState(numberOfballs));
  const [savedBalls, setSavedBalls] = useState([]);
  const [currentMove, setCurrentMove] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStart, setGameStart] = useState(false);
  const [ruleViolation, setRuleViolation] = useState(false);
  const userIsNext = currentMove % 2 === 0;

  // If available, fix this so that the user turn is random. It means
  // that the user must manually be reset every move.
  // const [userIsNext, setUserIsNext] = useState(Math.floor());
  // Also, no need to set the current move after every turn (user can review them in a different section with an account)

  const leftBalls = history[currentMove].left;
  const rightBalls = history[currentMove].right;

  const maxHeight = `${setMaxHeight(history[0].left.length, history[0].right.length)}px`;

  function handleBallClick(ball) {
    if (!gameStart) {
      setGameStart(true);
    }
    if (gameOver || history.length != currentMove + 1) return;
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
  }, [savedBalls])

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
    status = "Out of time";
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

  function handleRestart() {
    setHistory(generateInitialState(numberOfballs));
    setSavedBalls([]);
    setCurrentMove(0);
    setGameOver(false);
    setGameStart(false);
  }


  return (
    <>
      {isMobile ? (
        <div className="box">
          <div className="game">
            <div className="status" style={{ display: 'flex', backgroundColor: 'transparent' }}>
              <Counter isGameOver={gameOver} setter={setGameOver} maxSeconds={maxSeconds} hasStarted={gameStart} />
            </div >
            {ruleViolation && <WarningToggle />
            }
            <Board leftBalls={leftBalls} rightBalls={rightBalls} onBallClick={handleBallClick} savedBalls={savedBalls} maxHeight={maxHeight} />
            <br />
            {!gameOver && (<button className="button" onClick={handleConfirm}>Confirm Move</button>)}
            {
              gameOver && (
                <button className="button" onClick={handleRestart}>Restart Game</button>
              )
            }
            <div className="status" ref={gameInfo}>
              <p style={{ fontWeight: 'bold' }}>{status}</p>
              <ol>{moves}</ol>
            </div>
          </div>
        </div>
      ) : (
        <div className="box">
          <div className="game">
            <div className="status" style={{ display: 'flex', gap: '168px', padding: '10px', width: '640px', height: '100px', backgroundColor: 'transparent' }}>
              <p style={{ fontWeight: 'bold' }}>Player</p>
              <p style={{ fontWeight: 'bold' }}>{opponent}</p>
              <Counter isGameOver={gameOver} setter={setGameOver} maxSeconds={maxSeconds} hasStarted={gameStart} />
            </div >
            {ruleViolation && <WarningToggle />
            }
            <Board leftBalls={leftBalls} rightBalls={rightBalls} onBallClick={handleBallClick} savedBalls={savedBalls} maxHeight={maxHeight} />
            <br />
            {!gameOver && (<button className="button" onClick={handleConfirm}>Confirm Move</button>)}
            {
              gameOver && (
                <button className="button" onClick={handleRestart}>Restart Game</button>
              )
            }
          </div >
          <div className="status" ref={gameInfo}>
            <p style={{ fontWeight: 'bold' }}>{status}</p>
            <ol>{moves}</ol>
          </div>
        </div >
      )}
    </>
  );
}

export default Game;
