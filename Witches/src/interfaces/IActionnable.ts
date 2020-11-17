import { Store } from "../Store";
import { IGemmable } from "./IGemmable";

export abstract class IActionnable extends IGemmable {
  public abstract id: string;
  public abstract type: string;
  public abstract actionable: boolean;

  abstract isActionnable(store: Store): boolean;
}

export type ActionNullable = IActionnable | null;
