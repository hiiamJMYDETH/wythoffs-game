import "../styles/Game.css";
import { GenerateBalls } from "./Balls";

function Board({ leftBalls, rightBalls, onBallClick, savedBalls, maxHeight = '325px'}) {

    return (
      <div className="board">
        <div className="half-board" style={{height:maxHeight}}>
          <GenerateBalls balls={leftBalls} onBallClick={onBallClick} savedBalls={savedBalls} />
        </div>
        <div className="half-board" style={{height:maxHeight}}>
          <GenerateBalls balls={rightBalls} onBallClick={onBallClick} savedBalls={savedBalls} />
        </div>
      </div>
    );
  }

export default Board;