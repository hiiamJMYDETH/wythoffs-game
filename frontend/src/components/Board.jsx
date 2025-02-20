<<<<<<< HEAD
import "../styles/Game.css";
import { GenerateBalls } from "./Balls";

function Board({ leftBalls, rightBalls, onBallClick, savedBalls, maxHeight = '325px'}) {

    return (
      <div className="board">
        <div className="half-board" style={{height:maxHeight}}>
          <GenerateBalls balls={leftBalls} onBallClick={onBallClick} savedBalls={savedBalls} />
        </div>
        <div className="half-board" style={{height:maxHeight}}>
=======
import { GenerateBalls } from "./Balls";
import "../styles/Game.css";

function Board({ leftBalls, rightBalls, onBallClick, savedBalls}) {

    return (
      <div className="board">
        <div className="half-board">
          <GenerateBalls balls={leftBalls} onBallClick={onBallClick} savedBalls={savedBalls} />
        </div>
        <div className="half-board">
>>>>>>> efa72369a7cb309458e0731b7ff74db918251236
          <GenerateBalls balls={rightBalls} onBallClick={onBallClick} savedBalls={savedBalls} />
        </div>
      </div>
    );
  }

export default Board;