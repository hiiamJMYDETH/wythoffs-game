function CPUPlay(board) {
  const { left, right } = board;

  const takeLeft = left.map(b => `left-${b}`);

  const takeRight = right.map(b => `right-${b}`);

  const minPairs = Math.min(left.length, right.length);
  const takeBoth = [];
  for (let i = 0; i < minPairs; i++) {
    takeBoth.push(`left-${left[i]}`, `right-${right[i]}`);
  }

  const options = [takeLeft, takeRight, takeBoth];
  const bestMove = options.reduce((a, b) => (b.length > a.length ? b : a), []);

  return bestMove;
}

export default CPUPlay;
