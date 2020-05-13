export enum EWeapon {
  ROCK = "ROCK",
  PAPER = "PAPER",
  SCISSORS = "SCISSORS",
}

export const parseWeapon = (blob: string): EWeapon => (<any>EWeapon)[blob];

const COUNTERS = {
  [EWeapon.ROCK]: EWeapon.PAPER,
  [EWeapon.SCISSORS]: EWeapon.ROCK,
  [EWeapon.PAPER]: EWeapon.SCISSORS,
};

export const getCounter = (weapon: EWeapon): EWeapon => COUNTERS[weapon];

export const isBestWeapon = (w1: EWeapon, w2: EWeapon): boolean => w1 === COUNTERS[w2];
