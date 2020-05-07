import { ActionDescriptor, EActions, AStrategy, EStrategyAvancement } from "./Strategy";
import { Radar } from "./orchestrator/radar";

export class FollowerStrategy extends AStrategy {
  private radar: Radar;

  constructor(radar: Radar) {
    super();
    this.radar = radar;
  }

  computeRound = () => {
    if (this.radar.isInstalled()) {
      this.avancement = EStrategyAvancement.COMPLETED;
    }
  };

  computeAction = (): ActionDescriptor => {
    return {
      type: EActions.MOVE,
      param: this.radar.getPosition()
    };
  };
}
