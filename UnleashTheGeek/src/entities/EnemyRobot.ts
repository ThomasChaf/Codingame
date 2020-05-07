import { PositionUtils, IPosition } from "../utils/Position";
import { EItem } from "../utils/Item";
import { ARobot, EEntityType } from "./Types";
import { getBoard } from "../Board";

export class EnemyRobot extends ARobot {
  private hasItemLoaded: boolean = false;

  constructor(type: EEntityType, id: number) {
    super(type, id);
  }

  newRound = (position: IPosition, item: EItem) => {
    if (position.x === 0 && this.position && this.position.x === 0) {
      this.hasItemLoaded = true;
    }
    if (this.hasItemLoaded && position.x !== 0 && PositionUtils.equal(position, this.position)) {
      this.hasItemLoaded = false;

      getBoard().addDoubt(position);
      getBoard().addDoubt(PositionUtils.top(position));
      getBoard().addDoubt(PositionUtils.bottom(position));
      getBoard().addDoubt(PositionUtils.left(position));
      getBoard().addDoubt(PositionUtils.right(position));
    }
    this.position = position;
    this.item = item;
  };
}
