import { Cast } from "./Cast";
import { ActionAvailable } from "./interfaces/ActionAvailable";

export type CastNullable = Cast | null;

export class Casts {
  casts: Cast[] = [];

  reset() {
    this.casts = [];
  }

  add(id: string, gems: number[], castable: boolean, repeatable: boolean) {
    this.casts.push(new Cast(id, gems, castable, repeatable));
  }

  getById(id: string): Cast {
    return this.casts.find((cast) => cast.id === id) as Cast;
  }

  getCastAvailable(): ActionAvailable {
    const castAvailable: ActionAvailable = {};

    this.casts.forEach((cast) => {
      castAvailable[cast.id] = cast.actionable;
    });

    return castAvailable;
  }
}
