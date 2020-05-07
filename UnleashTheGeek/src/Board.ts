import { Case, ECaseState } from "./utils/Case";
import { IPosition, PositionUtils } from "./utils/Position";

class Board {
  private width: number;
  private height: number;
  private cases: Case[][];
  private oreCases: Case[] = [];
  private oreAmount: number = 0;

  init = (width: number, height: number) => {
    this.width = width;
    this.height = height;
    this.cases = [];

    for (let y = 0; y < height; y++) {
      const rowCases: Case[] = [];

      for (let x = 0; x < width; x++) {
        rowCases.push(new Case(x, y));
      }
      this.cases.push(rowCases);
    }
  };

  addDoubt = (position: IPosition | null) => {
    if (!position) return;

    this.getCase(position).addDoubt();
  };

  updateMap = (mapBlob: string[]) => {
    this.oreCases = [];
    this.oreAmount = 0;
    for (let y = 0; y < this.height; y++) {
      const rowBlob: string[] = mapBlob[y].split(" ");

      for (let x = 0; x < this.width; x++) {
        const currentCase: Case = this.getCase({ x, y });
        const ore: string = rowBlob[2 * x]; // amount of ore or "?" if unknown
        const hole: ECaseState = parseInt(rowBlob[2 * x + 1]); // 1 if cell has a hole

        currentCase.setCaseType(ore);
        if (ore !== "?") currentCase.update(ore, hole);

        if (currentCase.hasOre() && !currentCase.hasOnlyDoubt()) {
          this.oreCases.push(currentCase);
          if (currentCase.isVisible()) this.oreAmount += parseInt(ore);
        }
      }
    }
  };

  getCase = ({ x, y }: IPosition): Case | null => {
    if (x < 0 || x >= this.width) return null;
    if (y < 0 || y >= this.height) return null;

    return this.cases[y][x];
  };

  findNeareast = (from: IPosition, goalCases: Case[], toAvoid: IPosition[]): Case | null => {
    let closest: Case | null = null;
    let distance: number;

    console.error("FIND NEAREST:", goalCases.map(c => c.getPosition()));
    console.error("TO AVOID:", toAvoid);

    goalCases
      .filter((currentCase: Case) => !toAvoid.find(p1 => PositionUtils.equal(p1, currentCase.getPosition())))
      .forEach((currentCase: Case) => {
        const tmpDistance: number = PositionUtils.distanceTo(from, currentCase.getPosition());
        if (closest === null || tmpDistance < distance) {
          closest = currentCase;
          distance = tmpDistance;
        }
      });

    return closest;
  };

  findNeareastOre = (from: IPosition, toAvoid: IPosition[]): Case | null =>
    this.findNeareast(from, this.oreCases, toAvoid);

  getOreAmount = (): number => this.oreAmount;
}

let board: Board = null;

export const getBoard = (): Board => {
  if (!board) {
    board = new Board();
  }

  return board;
};
