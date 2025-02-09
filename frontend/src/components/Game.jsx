import React, { useEffect, useState } from 'react';
import CPUPlay from './CPU';
import "../styles/Game.css";

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

function Counter({isGameOver, setter, maxSeconds}) {
  if (isGameOver) {
    return (
      <div className="status timer" style={{display:'none'}}>
      <p style={{margin:'0px'}}> Results: </p>
      </div>
    )
  }
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (isGameOver) return;
    const intervalId = setInterval(() => {
      setCount(prev => prev + 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isGameOver]);

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
      <div className="status timer" style={{fontSize: '35px', justifySelf:'center'}}>
      <p> Out of time </p>
      </div>
    )
  }

  return (
    <div className="status timer" style={{fontSize: '70px', fontWeight: 'bold', justifySelf:'center'}}>
    <p style={{margin:'0px'}}> {min + ":" + seconds} </p>
    </div>
  )
}

function WarningToggle() {
  return (
    <div className="box rule-viol">
      <h2>You must pick either any amount from one side of the board or 
      equal amounts from both sides of the board.</h2>
    </div>
  )
}

function GenerateBalls({ balls, onBallClick, savedBalls }) {
  const isSelected = savedBalls ? (ball) => savedBalls.includes(ball) : () => false;
  return balls.map((ball, i) => (
    <Ball key={i} value={ball} onBallClick={onBallClick} isSelected={isSelected(ball)} />
  ));
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

function Game({numberOfballs, maxSeconds, isCPUPlaying}) {
  const generateInitialState = () => {
    const half = numberOfballs / 2;
    const totalBalls = Math.floor(Math.random() * (numberOfballs - half) + half);
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
  const [gameStart, setGameStart] = useState(false);
  const [ruleViolation, setRuleViolation] = useState(false);
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
    if (gameOver) return;
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
      // alert('Invalid move: Unequal removal from both sides');
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
      const ballsToSave = CPUPlay(history[currentMove])
      setSavedBalls(ballsToSave);
      handleConfirm();
    }
  }, [userIsNext, history, currentMove]);

  useEffect(() => {
    if (userIsNext) return;
    if (savedBalls && savedBalls.length > 0) {
      handleConfirm();
    }
  }, [savedBalls])

  let status;
  const winner = calculateWinner(leftBalls.length, rightBalls.length, userIsNext, isCPUPlaying);
  if (winner) {
    status = "Winner: " + winner;
  }
  else if (!gameOver) {
    status = "Next player: " + (userIsNext ? "you" : "computer");
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
        <button className="button" onClick={()=>jumpTo(move)}>{description}</button>
      </li>
    )
  });

  function handleRestart() {
    setHistory(generateInitialState());
    setSavedBalls([]);
    setCurrentMove(0);
    setGameOver(false); 
    setGameStart(false);
  }


  return (
    <div className="game">
      <div style={{display:'flex'}}>      
      <div className="status" style={{width: '200px'}}>
        {gameOver ? <p style={{fontWeight: 'bold'}}>Game Over</p> : <p style={{fontWeight: 'bold'}}>Move {currentMove + 1}</p>}
        <p style={{fontWeight: 'bold'}}>{status}</p>
      </div>
      {ruleViolation && <WarningToggle />}
      {gameStart && <Counter isGameOver={gameOver} setter={setGameOver} maxSeconds={maxSeconds}/>}
      </div>
      <Board leftBalls={leftBalls} rightBalls={rightBalls} onBallClick={handleBallClick} savedBalls={savedBalls} />
      <button className="button" onClick={handleConfirm}>Confirm Move</button>
      {gameOver && (
        <button className="button" onClick={handleRestart}>Restart Game</button>
      )}
      <div className="game-info" style={{display:'none'}}>
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

export default Game;
