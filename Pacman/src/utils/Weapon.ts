export enum EWeapon {
  ROCK = "ROCK",
  PAPER = "PAPER",
  SCISSORS = "SCISSORS",
}

export const parseWeapon = (blob: string): EWeapon => (<any>EWeapon)[blob];

const COUNTERS = {
  [EWeapon.ROCK]: EWeapon.SCISSORS,
  [EWeapon.SCISSORS]: EWeapon.PAPER,
  [EWeapon.PAPER]: EWeapon.ROCK,
};

export const getCounter = (weapon: EWeapon): EWeapon => COUNTERS[weapon];

export const isBestWeapon = (w1: EWeapon, w2: EWeapon): boolean => COUNTERS[w1] === w2;
