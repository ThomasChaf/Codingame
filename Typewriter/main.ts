const T: string = readline();

const elements = T.split(' ');

const ABBREVIATIONS = {
  'sp': ' ',
  'bS': "\\",
  'sQ': "'"
}

const repeat = (n: string, text: string) => {
  return text.repeat(parseInt(n))
}

const matchAbbreviation = (element: string) => {
  for (const abbreviation of ['sp', 'bS', 'sQ']) {
    if (element.endsWith(abbreviation)) {
      return [element.slice(0, -2), ABBREVIATIONS[abbreviation]]
    }
  }
  return null;
}

const result = elements.map((element) => {
  if (element === 'nl') return '\n';

  const abbreviation = matchAbbreviation(element);
  if (abbreviation) {
    const [n, text] = abbreviation;
    return repeat(n, text);
  }

  return repeat(element.slice(0, -1), element.slice(-1));
})

console.log(result.join(''));