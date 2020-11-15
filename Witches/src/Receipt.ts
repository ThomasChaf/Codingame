import { IGemmable } from "./interfaces/IGemmable";
import { ReceiptNullable } from "./Receipts";
import { ALL_COLOR } from "./utils";

interface MemoizeStore {
  [k: string]: number;
}

export class Receipt extends IGemmable {
  public id: string;
  public price: number;
  public couldBeBrew: boolean = false;
  public urgency: number;
  private memoizedZ: MemoizeStore = {};

  constructor(id: string, gems: number[], price: number, urgency: number) {
    super();
    this.id = id;
    this.price = price;
    this.urgency = urgency;
    this.set(gems);
  }

  calcDiffAt(nextGems: number[], color: number): number {
    return Math.abs(Math.min(nextGems[color] + this.at(color), 0));
  }

  calculateZ(_nextGems: number[]): number {
    const key = _nextGems.join("");
    if (this.memoizedZ[key]) return this.memoizedZ[key];

    const receipt = [...this.store];
    const nextGems: number[] = [..._nextGems];
    let z = 0;

    ALL_COLOR.forEach((color) => {
      let c = color;

      while (c >= 0) {
        nextGems[c] = nextGems[c] + receipt[c];

        if (nextGems[c] < 0) {
          if (c > 0) {
            receipt[c - 1] = nextGems[c];
          }
          z += Math.abs(nextGems[c]);
          nextGems[c] = 0;
        }
        receipt[c] = 0;

        c -= 1;
      }
    });

    this.memoizedZ[key] = z;
    return z;
  }

  prePlay(gems: number[]) {
    this.couldBeBrew = ALL_COLOR.every((color) => gems[color] + this.at(color) >= 0);
  }

  isBetterReceipt(receipt: ReceiptNullable, nbRound: number): boolean {
    if (!receipt) return true;

    if (this.id === receipt.id) return true;

    const priceDiff = receipt.price - this.price;
    if (priceDiff <= 0) return true;

    if (priceDiff / nbRound < 3) return true;

    return false;
  }
}
