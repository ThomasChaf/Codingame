import { Position } from "../Position";

export interface PacmanProperties {
  position: Position;
  abilityCooldown: number;
}

export abstract class APacman {
  protected position: Position;
  protected abilityCooldown: number;

  constructor(public id: number, properties: PacmanProperties) {
    this.abilityCooldown = properties.abilityCooldown;
    this.position = properties.position;
  }

  update(properties: PacmanProperties) {
    this.abilityCooldown = properties.abilityCooldown;
    this.position = properties.position;
  }

  getPosition(): Position {
    return this.position;
  }

  abilityAvailable(): boolean {
    return this.abilityCooldown === 0;
  }
}
