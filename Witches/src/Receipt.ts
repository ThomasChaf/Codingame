import { IGemmable } from "./interfaces/IGemmable";
import { ALL_COLOR } from "./utils";

export class Receipt extends IGemmable {
  public id: string;
  public price: number;
  public z: number = 0;

  constructor(id: string, gems: number[], price: number) {
    super();
    this.id = id;
    this.price = price;
    this.set(gems);
  }

  calculateZ(nextGems: number[]): number {
    let z = 0;

    ALL_COLOR.forEach((color) => {
      z += Math.abs(Math.min(0, nextGems[color] + this.at(color)));
    });

    return z;
  }

  prePlay(gems: number[]) {
    this.z = this.calculateZ(gems);
  }
}
