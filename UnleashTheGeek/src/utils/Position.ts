export class PositionUtils {
  static isInMap = (p: IPosition): boolean => 0 <= p.x && p.x < 30 && 0 <= p.y && p.y < 15;

  static isInMapOrNull = (p: IPosition): IPosition => (PositionUtils.isInMap(p) ? p : null);

  static right = (p: IPosition): IPosition | null => PositionUtils.isInMapOrNull({ x: p.x + 1, y: p.y });

  static left = (p: IPosition): IPosition | null => PositionUtils.isInMapOrNull({ x: p.x - 1, y: p.y });

  static bottom = (p: IPosition): IPosition | null => PositionUtils.isInMapOrNull({ x: p.x, y: p.y + 1 });

  static top = (p: IPosition): IPosition | null => PositionUtils.isInMapOrNull({ x: p.x, y: p.y - 1 });

  static equal = (p1: IPosition, p2: IPosition): boolean => {
    if (!p1 || !p2) return false;

    return p1.x === p2.x && p1.y === p2.y;
  };

  static distanceTo = (p1: IPosition, p2: IPosition): number => {
    return Math.sqrt(Math.pow(p2.y - p1.y, 2) + Math.pow(p2.x - p1.x, 2));
  };
}

export interface IPosition {
  x: number;
  y: number;
}
