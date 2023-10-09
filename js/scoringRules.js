function calculateSum(dice, target) {
  return dice
    .filter((num) => num === target)
    .reduce((sum, num) => sum + num, 0);
}

function ones(dice) {
  return calculateSum(dice, 1);
}

function twos(dice) {
  return calculateSum(dice, 2);
}

function threes(dice) {
  return calculateSum(dice, 3);
}

function fours(dice) {
  return calculateSum(dice, 4);
}

function fives(dice) {
  return calculateSum(dice, 5);
}

function sixes(dice) {
  return calculateSum(dice, 6);
}

function threeOfAKind(dice) {
  const counts = Array.from(
    { length: 6 },
    (_, num) => dice.filter((die) => die === num + 1).length
  );
  return counts.some((count) => count >= 3)
    ? dice.reduce((sum, num) => sum + num, 0)
    : 0;
}

function fourOfAKind(dice) {
  const counts = Array.from(
    { length: 6 },
    (_, num) => dice.filter((die) => die === num + 1).length
  );
  console.log(counts);
  return counts.some((count) => count >= 4)
    ? dice.reduce((sum, num) => sum + num, 0)
    : 0;
}

function fullHouse(dice) {
  const counts = Array.from(
    { length: 6 },
    (_, num) => dice.filter((die) => die === num + 1).length
  );
  return counts.includes(2) && counts.includes(3) ? 25 : 0;
}

function smallStraight(dice) {
  const uniqueDices = [...new Set(dice)];
  const sortedDice = uniqueDices.slice().sort((a, b) => a - b);
  return /1234|2345|3456/.test(sortedDice.join("")) ? 30 : 0;
}

function largeStraight(dice) {
  const uniqueDices = [...new Set(dice)];
  const sortedDice = uniqueDices.slice().sort((a, b) => a - b);
  return /12345|23456/.test(sortedDice.join("")) ? 40 : 0;
}

function yahtzee(dice) {
  const counts = Array.from(
    { length: 6 },
    (_, num) => dice.filter((die) => die === num + 1).length
  );
  return counts.includes(5) ? 50 : 0;
}

function chance(dice) {
  return dice.reduce((sum, num) => sum + num, 0);
}

function upperTableTotal() {
  let sum = 0;
  for (let i = 0; i <= 5; i++) {
    sum += Number(
      document.getElementById(
        `${functionNames[i].name.toLowerCase()}-${currentPlayer}`
      ).textContent
    );
  }
  return sum;
}

function bonus() {
  if (upperTableTotal() >= 63) return 35;
  else return 0;
}

//so far it adds up all the numbers from upper table total
function total(dice) {
  let sum = 0;
  for (let i = 8; i <= 15; i++) {
    sum += Number(
      document.getElementById(
        `${functionNames[i].name.toLowerCase()}-${currentPlayer}`
      ).textContent
    );
  }
  sum += upperTableTotal();
  sum += bonus();
  return sum;
}

const functionNames = [
  ones,
  twos,
  threes,
  fours,
  fives,
  sixes,
  upperTableTotal,
  bonus,
  threeOfAKind,
  fourOfAKind,
  fullHouse,
  smallStraight,
  largeStraight,
  yahtzee,
  chance,
  total,
];
