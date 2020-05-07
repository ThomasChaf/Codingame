import { ACTIONS, ActionDescriptor, AStrategy, EStrategyAvancement } from "../strategy/Strategy";
import { IPosition } from "../utils/Position";
import { StrategyDefiner } from "../strategy/Definer";
import { EItem } from "../utils/Item";
import { TGameContext } from "../Game";
import { ARobot, EEntityType } from "./Types";

export class Robot extends ARobot {
  private strategy: AStrategy = null;
  private strategyDefiner: StrategyDefiner = new StrategyDefiner();

  constructor(type: EEntityType, id: number) {
    super(type, id);
  }

  init = (initialPosition: IPosition, gameContext: TGameContext) => {
    this.position = initialPosition;
    this.strategy = this.strategyDefiner.select(this, gameContext);
  };
  getStrategy = (): AStrategy => this.strategy;

  newRound = (item: EItem, gameContext: TGameContext) => {
    this.item = item;
    this.strategy.computeRound(this);
    if (this.strategy.getAvancement() === EStrategyAvancement.COMPLETED) {
      this.strategy = this.strategyDefiner.select(this, gameContext);
    }
  };

  play = () => {
    // console.error("ROBOT:", this.id, "PLAY:", this.strategy.constructor.name);
    const actionDescriptor: ActionDescriptor = this.strategy.computeAction();

    ACTIONS[actionDescriptor.type](actionDescriptor.param);
  };
}
