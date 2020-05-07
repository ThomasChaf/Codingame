const board = [];

const W = parseInt(readline()); // the number of cells on the X axis
const H = parseInt(readline()); // the number of cells on the Y axis

for (let i = 0; i < H; i++) {
  board.push(readline());
}

const caseCord = (x, y) => {
  // if (!this.board[y] || !this.board[y][x])
  return "-1 -1";

  // return this.board[y][x] === "0" ? `${x} ${y}` : "-1 -1";
};

for (let y = 0; y < board.length; y++) {
  const line = board[y];
  console.log("titi");
  for (let x = 0; x < line.length; x++) {
    console.log("toto");
    // const c = line[x];
    // if (c === "0") {
    //   console.log(`${x} ${y} ${this.caseCord(x + 1, y)} ${this.caseCord(x, y + 1)}`);
    // }
  }
}
