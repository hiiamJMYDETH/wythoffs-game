function CPUPlay(board) {
    const leftBalls = board.left;
    const rightBalls = board.right;
    const map = [leftBalls, rightBalls];
    let i = 0, j = 0;
    let tempLeft = [], tempRight = [];

    while (i < leftBalls.length && j < rightBalls.length) {
        tempLeft.push(leftBalls[i]);
        tempRight.push(rightBalls[j]);
        i++;
        j++;
    }
    const finalSelection = [...tempLeft, ...tempRight];
    map.push(finalSelection);

    let max = 0;
    for (let j = 0; j < map.length; j++) {
        if (map[j].length > map[max].length) {
            max = j;
        }
    }
    return map[max]; 
}


export default CPUPlay;