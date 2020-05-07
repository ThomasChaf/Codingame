import { ActionDescriptor, EActions, AStrategy, EStrategyAvancement } from "./Strategy";

export class WaitorStrategy extends AStrategy {
  private hasWaited: boolean = false;

  computeRound(): void {
    if (this.hasWaited) {
      this.avancement = EStrategyAvancement.COMPLETED;
    } else {
      this.hasWaited = true;
    }
  }

  computeAction = (): ActionDescriptor => {
    return {
      type: EActions.WAIT,
      param: null
    };
  };
}
