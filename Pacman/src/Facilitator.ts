export class Facilitator {
  private moves: string[] = [];

  reset() {
    this.moves = [];
  }

  addMove(move: string) {
    this.moves.push(move);
  }

  shouldWait(move: string): boolean {
    return this.moves.includes(move);
  }
}
