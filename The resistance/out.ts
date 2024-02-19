const ALPHABET: { [k: string]: string } = {
  A: ".-",
  B: "-...",
  C: "-.-.",
  D: "-..",
  E: ".",
  F: "..-.",
  G: "--.",
  H: "....",
  I: "..",
  J: ".---",
  K: "-.-",
  L: ".-..",
  M: "--",
  N: "-.",
  O: "---",
  P: ".--.",
  Q: "--.-",
  R: ".-.",
  S: "...",
  T: "-",
  U: "..-",
  V: "...-",
  W: ".--",
  X: "-..-",
  Y: "-.--",
  Z: "--..",
};

const convertWord = (W: string) => {
  let word = "";
  for (let i = 0; i < W.length; i++) {
    word += ALPHABET[W[i]];
  }
  return word;
};
type Memo = { [key: number]: number };

function compare(morse: string, at: number, word: string) {
  if (at + word.length > morse.length) return false;
  for (let i = 0; i < word.length; i++) {
    if (morse[at + i] !== word[i]) return false;
  }
  return true;
}

function solve(words: string[], morse: string, at: number, memo: Memo) {
  if (at === morse.length) return 1;

  if (memo[at] !== undefined) return memo[at];

  let sum = 0;
  for (let i = 0; i < words.length; i++) {
    if (compare(morse, at, words[i])) {
      sum += solve(words, morse, at + words[i].length, memo);
    }
  }

  memo[at] = sum;

  return sum;
}



const mreadline = () => {
  const str = readline();
  console.error(str);
  return str;
};

const words: string[] = [];

const morse: string = mreadline();

const N: number = parseInt(mreadline());
for (let i = 0; i < N; i++) {
  words.push(mreadline());
}

console.log(solve(words.map(convertWord), morse, 0, {}));
