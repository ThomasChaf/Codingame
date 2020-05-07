class Game {
  private header: string[];
  private footer: string;
  private map: string[] = [];

  addHeader(line: string) {
    this.header = line.split("  ");
  }

  addRow(line: string) {
    this.map.push(line);
  }

  addFooter(line: string) {
    this.footer = line;
  }

  analyse(letter: string): string {
    let x: number = this.header.findIndex(l => l === letter) * 3;

    // console.log("START:", x);

    for (const y in this.map) {
      const line = this.map[y];

      if (line[x - 1] === "-") {
        // console.log("SWITCH LEFT:", y);
        x -= 3;
      } else if (line[x + 1] === "-") {
        // console.log("SWITCH RIGHT:", y);
        x += 3;
      }
    }

    // console.log("LETTER:", letter, x);

    return this.footer[x];
  }

  launch() {
    for (const letter of this.header) {
      // console.log("====================");
      const res = this.analyse(letter);

      console.log(`${letter}${res}`);
    }
  }
}

const inputs: string[] = readline().split(" ");
const H: number = parseInt(inputs[1]);

const game: Game = new Game();
game.addHeader(readline());
for (let i = 2; i < H; i++) {
  game.addRow(readline());
}
game.addFooter(readline());
game.launch();
