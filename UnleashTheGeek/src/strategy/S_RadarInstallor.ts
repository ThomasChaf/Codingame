import { ActionDescriptor, EActions, AStrategy, EStrategyAvancement } from "./Strategy";
import { EItem } from "../utils/Item";
import { Robot } from "../entities/Robot";
import { getRadarOrchestrator, Radar } from "./orchestrator/radar";
import { getBoard } from "../Board";

export class RadarInstallorStrategy extends AStrategy {
  radar: Radar;

  constructor(radar: Radar) {
    super();
    this.radar = radar;
  }

  computeRound = (robot: Robot) => {
    if (
      getBoard()
        .getCase(this.radar.getPosition())
        .hasOnlyDoubt()
    ) {
      this.radar.incrementPosition();
    }

    if (robot.getItem() !== EItem.RADAR) {
      this.radar.install();
      getRadarOrchestrator().install();
      this.avancement = EStrategyAvancement.COMPLETED;
    }
  };

  computeAction = (): ActionDescriptor => {
    return {
      type: EActions.DIG,
      param: this.radar.getPosition()
    };
  };
}
