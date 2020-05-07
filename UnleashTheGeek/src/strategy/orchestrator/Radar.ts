import { getBoard } from "../../Board";
import { IPosition, PositionUtils } from "../../utils/Position";
import { Robot } from "../../entities/Robot";
let radarOrchestrator: RadarOrchestrator;

let inc = 0;
const LAST_GOAL: IPosition = { x: 4, y: 13 };
const GOALS: IPosition[] = [
  { x: 5, y: 7 },
  { x: 10, y: 11 },
  { x: 9, y: 4 },
  { x: 15, y: 7 },
  { x: 19, y: 3 },
  { x: 19, y: 11 },
  { x: 24, y: 7 },
  { x: 26, y: 3 },
  { x: 26, y: 12 },
  { x: 13, y: 1 },
  { x: 3, y: 13 },
  { x: 3, y: 1 },
  LAST_GOAL
];

const nextGoal = (): IPosition => {
  const res: IPosition = GOALS[inc];
  inc += 1;

  return res;
};

export class Radar {
  private position: IPosition;
  private installed: boolean = false;

  constructor(position: IPosition) {
    this.position = position;
  }

  getPosition = (): IPosition => this.position;
  incrementPosition = () => {
    this.position.x += 1;
  };

  install = () => (this.installed = true);
  isInstalled = (): boolean => this.installed;
}

export class RadarOrchestrator {
  private allInstalled = false;
  private radar: Radar = null;

  install = () => {
    this.radar = null;
  };

  getLastRadar = (): Radar => {
    return this.radar;
  };

  willInstallRadar = (): boolean => this.radar !== null;

  addRadar = () => {
    const next: IPosition = nextGoal();

    if (PositionUtils.equal(next, LAST_GOAL)) {
      this.allInstalled = true;
    }

    this.radar = new Radar(next);
  };

  needNewRadar = (robot: Robot): boolean => {
    if (this.allInstalled || getBoard().getOreAmount() > 20) return false;

    if (robot.getPosition().x === 0 && !this.willInstallRadar()) return true;

    return getBoard().getOreAmount() < 10 && !this.willInstallRadar();
  };
}

export const getRadarOrchestrator = (): RadarOrchestrator => {
  if (!radarOrchestrator) {
    radarOrchestrator = new RadarOrchestrator();
  }

  return radarOrchestrator;
};
