import { GenerateBalls } from "./Balls";
import "../styles/Game.css";

function Board({ leftBalls, rightBalls, onBallClick, savedBalls}) {

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

export default Board;