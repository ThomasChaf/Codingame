export const asKey = (x: number, y: number) => `${x}-${y}`;

export class Position {
  public x: number;
  public y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  asKey(): string {
    return asKey(this.x, this.y);
  }

  sameAs(p: Position | null): boolean {
    if (!p) return false;

    return p.x === this.x && p.y === this.y;
  }
}
