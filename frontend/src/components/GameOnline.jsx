import { useEffect, useState, useRef } from 'react';
import Board from "./Board";
import Player from "./Player.jsx";
import { Counter, useMobileDetect, fetching } from "./utilities.jsx";
import { database } from "../../firebase.js";
import { ref, onChildAdded, off, onValue } from "firebase/database";
import "../styles/Game.css";
import "../styles/page.css";

const generateInitialState = async (numberOfBalls, totalSeconds, id, player, opponent) => {
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

    const state = await fetching('startonlinegame', 'POST', {
        left: leftArray,
        right: rightArray,
        numberOfBalls,
        totalSeconds,
        id,
        player,
        opponent
    });

    return state;
};

function useRematch(id, player, opponent) {
    const [rematch, setRematch] = useState(null);

    useEffect(() => {
        if (!id) return;

        const rematchRef = ref(database, `games/${id}/rematchState`);
        const unsubscribe = onValue(rematchRef, (snapshot) => {
            if (!snapshot.exists()) {
                setRematch(null);
                return;
            }

            const rematchState = snapshot.val();
            const playerState = rematchState[player];
            const opponentState = rematchState[opponent];

            if (playerState === '1' && opponentState === '1') {
                setRematch(true);
            }
            else if (playerState === '' || opponentState === '') {
                setRematch(null);
            }
            else {
                setRematch(false);
            }
        });

        return () => unsubscribe();
    }, [id, player, opponent]);

    return rematch;
}

function WarningToggle() {
    return (
        <div className="box rule-viol">
            <h2>You must pick either any amount from one side of the board or
                equal amounts from both sides of the board.</h2>
        </div>
    )
}

export default function GameOnline({ id, player, opponent, handleResult }) {
    const isMobile = useMobileDetect();
    const gameInfo = useRef();

    const [numberOfballs, setNumberOfballs] = useState(20);
    const [minutes, setMinutes] = useState(1);
    const [seconds, setSeconds] = useState(0);
    const [maxSeconds, setMaxSeconds] = useState(minutes * 60 + seconds);
    const [history, setHistory] = useState([]);
    const [savedBalls, setSavedBalls] = useState([]);
    const [currentMove, setCurrentMove] = useState(0);
    const [winner, setWinner] = useState(null);
    const [gameOver, setGameOver] = useState(false);
    const [gameStart, setGameStart] = useState(false);
    const [ruleViolation, setRuleViolation] = useState(false);
    const [gameSettings, setGameSettings] = useState(false);
    const [playerIsNext, setPlayerIsNext] = useState(true);

    const leftBalls = history?.[currentMove]?.left ?? [];
    const rightBalls = history?.[currentMove]?.right ?? [];
    console.log("History: ", history);
    console.log("Player turn: ", playerIsNext);

    useEffect(() => {
        if (!id) return;

        const historyRef = ref(database, `games/${id}/history`);

        const unsubscribe = onChildAdded(historyRef, (snapshot) => {
            const newMove = snapshot.val();
            const key = snapshot.key;

            setHistory(prev => {
                if (prev.some(m => m._key === key)) return prev;

                const updated = [...prev, { ...newMove, _key: key }];

                setPlayerIsNext(String(newMove.playerTurn) === String(player));
                setCurrentMove(updated.length - 1);

                if (String(newMove.movedBy) === String(player)) {
                    setSavedBalls([]);
                }

                const left = newMove.left ?? [];
                const right = newMove.right ?? [];
                if (left.length === 0 && right.length === 0) {
                    const winnerId = newMove.movedBy !== 'system' ? newMove.movedBy : null;
                    setWinner(winnerId);
                    setGameOver(true);

                    if (winnerId) {
                        fetching('fetchresults', 'POST', { gameId: id, player, opponent });
                    }
                }

                return updated;
            });
        });

        return () => off(historyRef, "child_added", unsubscribe);
    }, [id, player, opponent]);


    function handleBallClick(side, ball) {
        if (!playerIsNext || gameOver) return;
        if (!gameStart) setGameStart(true);
        const key = `${side}-${ball}`;
        setSavedBalls(prev =>
            prev.includes(key) ? prev.filter(b => b !== key) : [...prev, key]
        );
    }

    async function handleConfirm() {
        if (!playerIsNext || gameOver || savedBalls.length === 0) return;

        const lastState = history[currentMove];
        if (!lastState) return;

        const newLeftBalls = lastState.left ? lastState.left.filter(b => !savedBalls.includes(`left-${b}`)) : [];
        const newRightBalls = lastState.right ? lastState.right.filter(b => !savedBalls.includes(`right-${b}`)) : [];

        const prevLeftLength = lastState.left ? lastState.left.length : 0;
        const prevRightLength = lastState.right ? lastState.right.length : 0;
        const leftDiff = prevLeftLength - newLeftBalls.length;
        const rightDiff = prevRightLength - newRightBalls.length;

        if ((leftDiff !== rightDiff) && (leftDiff > 0) && (rightDiff > 0)) {
            setRuleViolation(true);
            setTimeout(() => setRuleViolation(false), 2000);
            return;
        }

        const nextTurn = playerIsNext ? opponent : player;

        await fetching("makeamove", "POST", {
            id,
            left: newLeftBalls,
            right: newRightBalls,
            move: currentMove + 1,
            playerTurn: nextTurn,
            movedBy: player
        });

        setSavedBalls([]);
    }

    useEffect(() => {
        if (gameOver) {
            handleResult(true);
        }
    }, [gameOver, handleResult]);

    async function handleRestart() {
        const totalSeconds = minutes * 60 + seconds;

        await generateInitialState(numberOfballs, totalSeconds, id, player, opponent);
        setSavedBalls([]);
        setCurrentMove(0);
        setGameOver(false);
        setGameStart(false);
    }

    let status;
    if (winner) {
        status = "Winner: " + (!playerIsNext ? "You" : opponent);
    }
    else if (!gameOver) {
        status = "Next player: " + (playerIsNext ? "You" : opponent);
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

    function jumpTo(nextMove) {
        setCurrentMove(nextMove);
    }

    return (
        <div
            style={{ display: 'flex' }}
            onClick={() => setGameSettings(false)}
        >
            {ruleViolation && <WarningToggle />
            }
            {(history.length === 0 || gameSettings) &&
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
                        generateInitialState(numberOfballs, totalSeconds, id, player, opponent);
                        setCurrentMove(0);
                        setGameSettings(false);
                    }}>
                        Start Game
                    </button>
                </div>
            }
            {history.length !== 0 &&
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
                </>
            }
        </div>
    );
}
