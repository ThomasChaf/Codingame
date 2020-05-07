import { EItem } from "../utils/Item";
import { IPosition } from "../utils/Position";

export enum EEntityType {
  ROBOT = 0,
  ENNEMY_ROBOT,
  RADAR,
  TRAP
}

export abstract class AEntity {
  id: number;
  protected position: IPosition;
  protected type: EEntityType;

  constructor(type: EEntityType, id: number) {
    this.type = type;
    this.id = id;
  }

  setPosition = (position: IPosition) => (this.position = position);
  getPosition = (): IPosition => this.position;
}

export abstract class ARobot extends AEntity {
  protected item: EItem = EItem.NONE;

  constructor(type: EEntityType, id: number) {
    super(type, id);
  }

  setItem = (item: EItem) => (this.item = item);
  getItem = (): EItem => this.item;
}
