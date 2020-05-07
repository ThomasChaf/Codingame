import { AStrategy } from "./Strategy";
import { RadarRequestorStrategy } from "./S_RadarRequestor";
import { RadarInstallorStrategy } from "./S_RadarInstallor";
import { CollectorStrategy } from "./S_Collector";
import { DeliverorStrategy } from "./S_Deliveror";
import { WaitorStrategy } from "./S_Waitor";
import { Robot } from "../entities/Robot";
import { EStrategyType } from "./Strategy";
import { Case } from "../utils/Case";
import { EItem } from "../utils/Item";
import { TGameContext } from "../Game";
import { getOreOrchestrator } from "./orchestrator/Ore";
import { getRadarOrchestrator, RadarOrchestrator } from "./orchestrator/Radar";
import { getBoard } from "../Board";
import { FollowerStrategy } from "./S_Follower";

export class StrategyDefiner {
  private state: EStrategyType = EStrategyType.UNDEFINED;

  select = (robot: Robot, gameContext: TGameContext): AStrategy => {
    const radarOrchestrator: RadarOrchestrator = getRadarOrchestrator();
    const nearest: Case | null = getBoard().findNeareastOre(
      robot.getPosition(),
      getOreOrchestrator().getGoalPositions()
    );

    if (this.state === EStrategyType.RADAR_REQUESTOR) {
      this.state = EStrategyType.RADAR_INSTALLOR;
      return new RadarInstallorStrategy(radarOrchestrator.getLastRadar());
    }

    if (robot.getItem() === EItem.ORE) {
      this.state = EStrategyType.DELIVEROR;
      return new DeliverorStrategy(robot);
    }

    if (radarOrchestrator.needNewRadar(robot) && gameContext.radarCd === 0) {
      radarOrchestrator.addRadar();
      this.state = EStrategyType.RADAR_REQUESTOR;
      return new RadarRequestorStrategy();
    }

    if (nearest !== null && robot.getItem() === EItem.NONE) {
      this.state = EStrategyType.COLLECTOR;
      return new CollectorStrategy(robot, nearest.getPosition());
    }

    if (radarOrchestrator.willInstallRadar()) {
      this.state = EStrategyType.FOLLOWER;
      return new FollowerStrategy(radarOrchestrator.getLastRadar());
    }

    this.state = EStrategyType.WAITOR;
    return new WaitorStrategy();
  };
}
