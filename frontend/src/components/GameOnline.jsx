import { useEffect, useState, useRef } from 'react';
import Board from "./Board";
import Player from "./Player.jsx";
import { Counter, useMobileDetect, fetchGameState, WarningToggle } from "./utilities.jsx";
import { database } from "../config/firebase.js";
import { ref, onChildAdded, off, get } from "firebase/database";
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

    const left = Array.from({ length: leftCount }, (_, i) => i + 1);
    const right = Array.from({ length: rightCount }, (_, i) => i + 1);

    const determineTurn = Math.random() < 0.5;
    const playerTurn = determineTurn ? player : opponent;

    const initialState = {
        id,
        left,
        right,
        numberOfBalls,
        totalSeconds,
        playerTurn,
        movedBy: "system",
        move: 0,
        timeShot: Date.now()
    }

    const response = await fetchGameState('changegamestate', 'POST', { action: 'makenew', body: initialState });
    return response;
};

async function confirmMove(request) {
    const { id, left = [], right = [], move, playerTurn, movedBy } = request;
    const histRef = ref(database, `games/${id}/history`);
    const histSnap = await get(histRef);
    if (!histSnap.exists()) {
        return false;
    }

    const userSnap = await get(ref(database, `games/${id}/players`));
    if (!userSnap.exists()) {
        return false;
    }
    const hist = histSnap.val();
    const history = hist ? Object.values(hist) : [];
    const lastState = history[history.length - 1];


    const lastLeft = lastState?.left || [];
    const lastRight = lastState?.right || [];

    if (left.length === lastLeft.length && right.length === lastRight.length) {
        return false;
    }

    const requestedMove = {
        id,
        left: Array.isArray(left) ? left : [],
        right: Array.isArray(right) ? right : [],
        move,
        movedBy,
        playerTurn
    };


    const result = await fetchGameState('changegamestate', 'POST', { action: 'confirmmove', body: requestedMove });
    if (result.status) {
        return true;
    }
    return false;
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

    useEffect(() => {
        if (!id) return;

        const historyRef = ref(database, `games/${id}/history`);

        const callback = (snapshot) => {
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

                const left = newMove?.left ?? [];
                const right = newMove?.right ?? [];
                const isSystemMove = newMove.movedBy === "system";
                if ((left.length === 0 && right.length === 0) && !isSystemMove && newMove.move !== 0) {
                    const winnerId = newMove.movedBy;
                    setWinner(winnerId);
                    setGameOver(true);
                }
                return updated;
            });
        };

        onChildAdded(historyRef, callback);

        return () => off(historyRef, "child_added", callback);
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

        const lastState = history[history.length - 1];
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

        const request = {
            id,
            left: newLeftBalls,
            right: newRightBalls,
            move: history?.length,
            playerTurn: nextTurn,
            movedBy: player
        };

        const result = await confirmMove(request);

        if (!result) {
            setRuleViolation(true);
            setTimeout(() => setRuleViolation(false), 2000);
            return;
        }
        setSavedBalls([]);
    }

    useEffect(() => {
        async function reportResults() {
            const response = await fetchGameState('changegamestate', 'POST', { action: 'endgame', body: { gameId: id, player, opponent } });
            if (!response) return false;
            handleResult(true);
            return true;
        }
        if (gameOver) {
            reportResults();
        }
    }, [gameOver, handleResult]);

    let status;
    if (winner) {
        status = "Winner: " + (!playerIsNext ? "You" : "Opponent");
    }
    else if (!gameOver) {
        status = "Turn: " + (playerIsNext ? "You" : "Opponent");
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
                        setMaxSeconds(totalSeconds);
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
                            <Player name={player} />
                            <Player name={opponent} />
                        </div >
                    </div>
                    <div className="status" ref={gameInfo}>
                        <div style={{ display: 'flex' }}>
                            <Counter isGameOver={gameOver} setter={setGameOver} maxSeconds={maxSeconds} hasStarted={gameStart} gameId={id} />
                            <p style={{ fontWeight: 'bold' }}>{status}</p>
                        </div>
                        <div style={{ width: '200px', height: '360px', overflowY: 'auto' }}>
                            <ol>{moves}</ol>
                        </div>
                        <div style={{ bottom: '0', margin: '5px', justifyContent: 'center' }}>
                            <button className="button main" onClick={handleConfirm} style={{ minHeight: '90px', width: '200px' }}>Confirm Move</button>
                        </div>
                    </div>
                </>
            }
        </div>
    );
}
