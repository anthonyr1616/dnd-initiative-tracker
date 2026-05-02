function decimalToFraction(decimal) {
  if (decimal === parseInt(decimal)) {
    return decimal;
  }

  let decimalString = decimal.toString();
  let decimalPlaces = decimalString.split(".")[1]
    ? decimalString.split(".")[1].length
    : 0;

  let denominator = Math.pow(10, decimalPlaces);
  let numerator = decimal * denominator;

  function gcd(a, b) {
    return b === 0 ? a : gcd(b, a % b);
  }

  let commonDivisor = gcd(numerator, denominator);

  return `${numerator / commonDivisor}/${denominator / commonDivisor}`;
}

function makeUrl(url) {
  const BASE_URL = "https://www.dnd5eapi.co/";

  return new URL(url, BASE_URL).toString();
}

const formatKeyValueArray = (obj, capitalize = true) =>
  Object.entries(obj).map(([key, value]) => {
    const formattedKey = capitalize
      ? key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
      : key;
    return `${formattedKey} ${value}`;
  });

const calculateModifier = (score) => Math.floor((score - 10) / 2);

const rollDice = (sides) => Math.floor(Math.random() * sides) + 1;

const rollHitDice = (formula) => {
  if (!formula) return null;
  const match = formula.match(/(\d+)d(\d+)\s*([+-]\s*\d+)?/i);
  if (!match) return null;
  const count = parseInt(match[1]);
  const sides = parseInt(match[2]);
  let total = 0;
  for (let i = 0; i < count; i++) total += rollDice(sides);
  if (match[3]) total += parseInt(match[3].replace(/\s+/g, ""));
  return Math.max(1, total);
};

export { decimalToFraction, makeUrl, formatKeyValueArray, calculateModifier, rollDice, rollHitDice };
