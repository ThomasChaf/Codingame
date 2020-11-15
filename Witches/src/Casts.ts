import { Cast } from "./Cast";

export type CastNullable = Cast | null;

export class Casts {
  casts: Cast[] = [];

  reset() {
    this.casts = [];
  }

  add(id: string, toppings: number[], castable: boolean) {
    this.casts.push(new Cast(id, castable, toppings));
  }
}
