import { Pacman } from "./pacmans/Pacman";

export const asKey = (x: number, y: number) => `${x}-${y}`;

export const DIRECTIONS = [
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0],
];

export const sameDirection = (p1: Position, p2: Position, goal: Position): boolean => {
  const p1dirX = Math.sign(p1.x - goal.x);
  const p1dirY = Math.sign(p1.y - goal.y);
  const p2dirX = Math.sign(p2.x - goal.x);
  const p2dirY = Math.sign(p2.y - goal.y);

  console.error("DEBUG:", "SAME DIRE:", p1dirX, p2dirX, p1dirY, p2dirY);

  return p1dirX === p2dirX && p1dirY === p2dirY;
};

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
