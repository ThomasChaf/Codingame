import { Receipt } from "./Receipt";
import { Store } from "./Store";

export type ReceiptNullable = Receipt | null;

export class Receipts {
  private receipts: Receipt[] = [];

  reset() {
    this.receipts = [];
  }

  addOrder(id: string, gems: number[], price: number) {
    this.receipts.push(new Receipt(id, gems, price));
  }

  findFastestReceipt(nextGems: number[]): [ReceiptNullable, number] {
    let fastestZ: number = 0;
    let fastestReceipt: ReceiptNullable = null;

    this.receipts.forEach((receipt) => {
      const nextZ = receipt.calculateZ(nextGems);
      if (nextZ >= receipt.z) return;

      if (!fastestReceipt || nextZ < fastestZ) {
        fastestZ = nextZ;
        fastestReceipt = receipt;
      }
    });

    return [fastestReceipt, fastestZ];
  }

  findMoreExpensiveReceipt(myStore: Store): ReceiptNullable {
    let expensiveReceipt: ReceiptNullable = null;

    this.receipts.forEach((receipt) => {
      const hasEnough = myStore.hasEnoughGems(receipt);
      if (hasEnough && (!expensiveReceipt || receipt.price > expensiveReceipt.price)) {
        expensiveReceipt = receipt;
      }
    });

    return expensiveReceipt;
  }

  prePlay(myStore: Store) {
    this.receipts.forEach((receipt) => {
      receipt.prePlay(myStore.getGems());
    });
  }
}
