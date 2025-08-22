import { Ball, GenerateBalls } from "./Balls";
import "../styles/Game.css";

function Board({ leftBalls, rightBalls, onBallClick, savedBalls }) {

  return (
    <div className="board">
      {/* <div className="half-board">
        <GenerateBalls balls={leftBalls} onBallClick={onBallClick} savedBalls={savedBalls} />
      </div>
      <div className="half-board">
        <GenerateBalls balls={rightBalls} onBallClick={onBallClick} savedBalls={savedBalls} />
      </div> */}
      <div className="half-board">
        {leftBalls.map(ball => (
          <Ball
            key={ball}
            number={ball}
            onBallClick={() => onBallClick('left', ball)}
            isSelected={savedBalls.includes(`left-${ball}`)}
          />
        ))}
      </div>
      <div className="half-board">
        {rightBalls.map(ball => (
          <Ball
            key={ball}
            number={ball}
            onBallClick={() => onBallClick('right', ball)}
            isSelected={savedBalls.includes(`right-${ball}`)}
          />
        ))}
      </div>
    </div>
  );
}

export default Board;