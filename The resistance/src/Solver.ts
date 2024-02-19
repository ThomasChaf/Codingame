type Memo = { [key: number]: number };

function compare(morse: string, at: number, word: string) {
  if (at + word.length > morse.length) return false;
  for (let i = 0; i < word.length; i++) {
    if (morse[at + i] !== word[i]) return false;
  }
  return true;
}

export function solve(words: string[], morse: string, at: number, memo: Memo) {
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
