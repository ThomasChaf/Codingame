import { Receipt } from "./Receipt";
import { Store } from "./Store";

export type ReceiptNullable = Receipt | null;

type FindResult = [ReceiptNullable, number];

export class Receipts {
  private receipts: Receipt[] = [];

  reset() {
    this.receipts = [];
  }

  addOrder(id: string, gems: number[], price: number, urgency: number) {
    this.receipts.push(new Receipt(id, gems, price, urgency));
  }

  findFastestReceipt(nextGems: number[], initZ: number): FindResult {
    let fastestZ: number = initZ;
    let fastestReceipt: ReceiptNullable = null;

    this.receipts.forEach((receipt) => {
      const nextZ = receipt.calculateZ(nextGems);

      if (!fastestReceipt || nextZ < fastestZ) {
        fastestZ = nextZ;
        fastestReceipt = receipt;
      }
    });

    return [fastestReceipt, fastestZ];
  }

  prePlay(myStore: Store): ReceiptNullable {
    this.receipts.forEach((receipt) => {
      receipt.prePlay(myStore.getGems());
    });
    this.receipts = this.receipts.sort((a, b) => b.price - a.price);

    const bestReceiptPrice = this.receipts[0].price;
    this.receipts = this.receipts.filter((receipt) => bestReceiptPrice - 10 < receipt.price);

    return this.receipts.find((receipt) => receipt.couldBeBrew) || null;
  }
}
