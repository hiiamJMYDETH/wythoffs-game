import { useEffect, useState, useRef } from 'react';
import Board from "./Board";
import Player from "./Player.jsx";
import { Counter, useMobileDetect, fetching } from "./utilities.jsx";
import "../styles/Game.css";
import "../styles/page.css";

const generateInitialState = (numberOfBalls, totalSeconds, id, player, opponent) => {
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

    const leftArray = Array.from({ length: leftCount }, (_, i) => i + 1);
    const rightArray = Array.from({ length: rightCount }, (_, i) => i + 1);

    fetching('startonlinegame', 'POST', {
        left: leftArray,
        right: rightArray,
        numberOfBalls,
        totalSeconds,
        id,
        player,
        opponent
    });

    return [{
        left: leftArray,
        right: rightArray
    }];
};

function WarningToggle() {
  return (
    <div className="box rule-viol">
      <h2>You must pick either any amount from one side of the board or
        equal amounts from both sides of the board.</h2>
    </div>
  )
}

function calculateWinner(leftBalls, rightBalls) {

  return null
}


export default function GameOnline({ id, player, opponent }) {
    const determineTurn = Math.random() < 0.5;
    const isMobile = useMobileDetect();
    const gameInfo = useRef();

    const [numberOfballs, setNumberOfballs] = useState(20);
    const [minutes, setMinutes] = useState(1);
    const [seconds, setSeconds] = useState(0);
    const [maxSeconds, setMaxSeconds] = useState(minutes * 60 + seconds);
    const [gameState, setGameState] = useState([]);
    const [history, setHistory] = useState([]);
    const [savedBalls, setSavedBalls] = useState([]);
    const [currentMove, setCurrentMove] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [gameStart, setGameStart] = useState(false);
    const [ruleViolation, setRuleViolation] = useState(false);
    const [gameSettings, setGameSettings] = useState(false);
    const [playerIsNext, setPlayerIsNext] = useState(determineTurn);


    const leftBalls = gameState?.[currentMove]?.left ?? [];
    const rightBalls = gameState?.[currentMove]?.right ?? [];

    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                const data = await fetching(`getgame?id=${id}`, 'GET');
                const gameData = data?.GameData;
                if (!gameData) return;

                const { left, right } = gameData;
                if (!Array.isArray(left) || !Array.isArray(right)) return;

                setGameState(prevState => {
                    const lastState = prevState[prevState.length - 1];
                    if (!lastState || JSON.stringify(lastState) !== JSON.stringify(gameData)) {
                        return [...prevState, gameData];
                    }
                    return prevState;
                });

            } catch (err) {
                console.error(err);
            }
        }, 2000);

        return () => clearInterval(interval);
    }, [id]);

    // function handleBallClick(ball) {
    //     if (!gameStart) setGameStart(true);
    //     if (gameOver || gameSettings)
    //         return; setSavedBalls(prev => prev.includes(ball) ? prev.filter(b => b !== ball) : [...prev, ball]);
    // }
    function handleBallClick(side, ball) {
        const key = `${side}-${ball}`;
        setSavedBalls(prev =>
            prev.includes(key) ? prev.filter(b => b !== key) : [...prev, key]
        );
    }


    function handleConfirm() {
        if (savedBalls.length === 0 || gameSettings) return;


        const lastState = gameState[currentMove];
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


        setHistory(prevState => [
            ...prevState.slice(0, currentMove + 1),
            { left: newLeftBalls, right: newRightBalls },
        ]);
        setSavedBalls([]);
        setCurrentMove(prevMove => prevMove + 1);


        if (newLeftBalls.length === 0 && newRightBalls.length === 0) {
            setGameOver(true);
        }
    }

    function handleRestart() {
        const init = generateInitialState(numberOfballs, maxSeconds, id, player, opponent);
        // setHistory([init]);
        setGameState(init);
        setSavedBalls([]);
        setCurrentMove(0);
        setGameOver(false);
        setGameStart(false);
    }

    let status;
    const winner = calculateWinner(leftBalls.length, rightBalls.length);
    if (winner) {
        status = "Winner: " + winner;
    }
    else if (!gameOver) {
        status = "Next player: ";
    }
    else {
        status = "Game Over";
    }

    return (
        <div
            style={{ display: 'flex' }}
            onClick={() => setGameSettings(false)}
        >
            {ruleViolation && <WarningToggle />
            }
            {(gameState.length === 0 || gameSettings) &&
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
                            onChange={(e) => setNumberOfballs(Number(e.target.value))}
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
                            value={minutes}
                            onChange={(e) => setMinutes(Number(e.target.value))}
                        />
                        <h3 className="settings-text">:</h3>
                        <input
                            type="number"
                            className="seconds"
                            min="0"
                            max="59"
                            value={seconds}
                            onChange={(e) => setSeconds(Number(e.target.value))}
                        />
                    </div>
                    <br />
                    <button className="button" onClick={() => {
                        const totalSeconds = parseInt(minutes) * 60 + parseInt(seconds);
                        const init = generateInitialState(numberOfballs, totalSeconds, id, player, opponent);
                        setHistory([init]);
                        setCurrentMove(0);
                        setGameSettings(false);
                    }}>
                        Start Game
                    </button>
                </div>
            }
            {gameState.length != 0 &&
                <>
                    <div className="game">
                        <Board leftBalls={leftBalls} rightBalls={rightBalls} onBallClick={handleBallClick} savedBalls={savedBalls} />
                        <div className="status" style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', width: '100%', backgroundColor: 'transparent' }}>
                            <Player name={"You"} />
                            <Player name={opponent} />
                        </div >
                    </div>
                    <div className="status" ref={gameInfo}>
                        <div style={{ display: 'flex' }}>
                            {/* <Counter isGameOver={gameOver} setter={setGameOver} maxSeconds={maxSeconds} hasStarted={gameStart} /> */}
                            <p style={{ fontWeight: 'bold' }}>{status}</p>
                        </div>
                        {/* <div style={{ width: '200px', height: '360px', overflowY: 'auto' }}>
                            <ol>{moves}</ol>
                        </div> */}
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
                </>
            }
        </div>
    );
}
