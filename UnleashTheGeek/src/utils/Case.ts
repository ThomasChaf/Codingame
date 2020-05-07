import { IPosition } from "./Position";

export enum ECaseType {
  UNKOWN,
  KNOWN
}

export enum ECaseState {
  EMPTY = 0,
  DIG = 1
}

export class Case {
  private doubt: boolean = false;
  private position: IPosition;
  private type: ECaseType = ECaseType.UNKOWN;
  private ore: number;
  private hole: ECaseState;

  constructor(x: number, y: number) {
    this.position = { x, y };
  }

  getPosition = (): IPosition => this.position;
  getType = (): ECaseType => this.type;
  getOre = (): number => this.ore;
  getHole = (): ECaseState => this.hole;

  addDoubt = () => (this.doubt = true);
  hasDoubt = (): boolean => this.doubt || this.type === ECaseType.UNKOWN;
  hasOnlyDoubt = (): boolean => this.doubt;
  isVisible = (): boolean => this.type === ECaseType.KNOWN;

  setCaseType = (ore: string) => {
    this.type = ore === "?" ? ECaseType.UNKOWN : ECaseType.KNOWN;
  };

  update = (ore: string, hole: ECaseState) => {
    this.ore = ore === "?" ? 0 : parseInt(ore);
    this.hole = hole;
  };

  collectOre = () => {
    this.ore -= 1;
  };

  isDigged = (): boolean => this.hole === ECaseState.DIG;

  hasOre = (): boolean => this.ore >= 1;
}
