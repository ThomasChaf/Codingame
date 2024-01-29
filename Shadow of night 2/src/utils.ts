export type Point = {
  x: number;
  y: number;
};

export const distance = ({ x: xa, y: ya }: Point, { x: xb, y: yb }: Point) => {
  return Math.sqrt((xb - xa) * (xb - xa) + (yb - ya) * (yb - ya));
};

export const equalP = ({ x: x1, y: y1 }: Point, { x: x2, y: y2 }: Point) => {
  return x1 === x2 && y1 === y2;
};
