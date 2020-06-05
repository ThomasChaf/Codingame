type MLocation = [number, number];

class Square {
  public min: MLocation;
  public max: MLocation;
  constructor(private W: number, private H: number) {
    this.min = [0, 0];
    this.max = [W - 1, H - 1];
  }

  between(p1: MLocation, p2: MLocation): MLocation {
    const [minX, minY] = this.min;
    const [maxX, maxY] = this.max;
    const W = maxX - minX + 1;
    const H = maxY - minY + 1;

    if (p1[0] === p2[0]) {
      const newY = this.min[1] + Math.floor(H / 2);

      this.min = [this.min[0], newY];
      this.max = [this.max[0], newY];
      return [p2[0], newY];
    } else {
      const newX = this.min[0] + Math.floor(W / 2);

      this.min = [newX, this.min[1]];
      this.max = [newX, this.max[1]];
      return [newX, p2[1]];
    }
  }

  split(p1: MLocation, p2: MLocation, isWarm: boolean) {
    const [minX, minY] = this.min;
    const [maxX, maxY] = this.max;
    const W = maxX - minX + 1;
    const H = maxY - minY + 1;

    if (p1[0] === p2[0]) {
      if ((isWarm && p2[1] < p1[1]) || (!isWarm && p2[1] > p1[1])) {
        this.max = [this.max[0], this.min[1] + Math.floor(H / 2) - 1];
      } else {
        this.min = [this.min[0], this.min[1] + Math.ceil(H / 2)];
      }
    } else {
      if ((isWarm && p2[0] < p1[0]) || (!isWarm && p2[0] > p1[0])) {
        this.max = [this.min[0] + Math.floor(W / 2) - 1, this.max[1]];
      } else {
        this.min = [this.min[0] + Math.ceil(W / 2), this.min[1]];
      }
    }

    console.error("SPLIT:", JSON.stringify(this.min), JSON.stringify(this.max));
  }

  symetryOf([x, y]: MLocation): MLocation {
    const [minX, minY] = this.min;
    const [maxX, maxY] = this.max;
    const W = maxX - minX;
    const H = maxY - minY;

    if (W > H) {
      let newX = maxX - (x - minX);

      if (newX === x) newX = newX - 1 >= minX ? newX - 1 : newX + 1;

      return [newX, y];
    } else {
      let newY = maxY - (y - minY);

      if (newY === y) newY = newY - 1 >= minY ? newY - 1 : newY + 1;

      return [x, newY];
    }
  }
}

export class Solver {
  private square: Square;
  private prevPos: MLocation = [0, 0];
  private position: MLocation;
  private back: boolean = false;

  constructor(W: number, H: number, private N: number, X0: number, Y0: number) {
    this.square = new Square(W, H);
    this.position = [X0, Y0];
  }

  jump([newX, newY]: MLocation) {
    if (newX > this.square.max[0]) newX = this.square.max[0];
    if (newX < this.square.min[0]) newX = this.square.min[0];
    if (newY > this.square.max[1]) newY = this.square.max[1];
    if (newY < this.square.min[1]) newY = this.square.min[1];

    this.prevPos = this.position;
    this.position = [newX, newY];

    console.log(newX, newY);
  }

  solve(bombdir: string) {
    if (bombdir === "UNKNOWN") {
      const next = this.square.symetryOf(this.position);

      this.jump(next);
    }
    if (this.back || bombdir === "WARMER") {
      if (!this.back) this.square.split(this.prevPos, this.position, true);
      const next = this.square.symetryOf(this.position);

      this.back = false;
      this.jump(next);
    } else if (bombdir === "COLDER") {
      this.square.split(this.prevPos, this.position, false);
      this.back = true;

      this.jump(this.prevPos);
    } else if (bombdir === "SAME") {
      const next = this.square.between(this.prevPos, this.position);

      this.back = true;
      this.jump(next);
    }
  }
}
