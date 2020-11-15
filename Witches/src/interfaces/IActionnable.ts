import { ActionAvailable } from "./ActionAvailable";
import { IGemmable } from "./IGemmable";

export abstract class IActionnable extends IGemmable {
  public abstract id: string;
  public abstract type: string;
  public abstract actionable: boolean;
  public abstract repeatable: boolean;

  abstract computeNextGems(
    storeGems: number[],
    bookAvailable: ActionAvailable,
    castAvailable: ActionAvailable
  ): number[] | null;
}

export type ActionNullable = IActionnable | null;
