//throw and round number
let rollNumber = 0;
let roundNumber = 1;

//dice information
let diceRolled = []; //all dice in play array
let diceOnTable = []; //on-table dice array
let diceSelected = []; //selected dices array
let currentDiceIndex; //dice selection/deselection
let lockedDice = [false, false, false, false, false];
let currentPlayer = 1;

//DOM Elements
const diceArea = document.getElementsByClassName("dice-display");
const rollButton = document.getElementById("rollDice");

//events
rollButton.addEventListener("click", function () {
  if (rollNumber < 20) {
    randomDice(), rollNumber++;
  }
});

randomDice();
//Random number between 1-6
//create array with selected values
function randomDice() {
  oldDices = diceRolled;
  diceRolled = [];
  for (let i = 0; i < 5; i++) {
    if (lockedDice[i]) {
      diceRolled.push(oldDices[i]);
    } else {
      const randomNumber = Math.floor(Math.random() * 6) + 1;
      diceRolled.push(randomNumber);
    }
  }
  console.log(diceRolled);
  updateDiceImages();
  displaySpeculativeScore();
}

function updateDiceImages() {
  const diceContainer = document.querySelector(".dice-display");
  const diceElements = diceContainer.querySelectorAll(".dice");

  for (let i = 0; i < diceRolled.length; i++) {
    if (!lockedDice[i]) {
      const diceImg = diceElements[i];
      const diceNumber = diceRolled[i];
      diceImg.src = `/images/dice-${diceNumber}.png`;
      diceImg.alt = `Dice ${diceNumber}`;
    }
  }
}

//lock dices on table and push to selected array
function toggleLock(index) {
  lockedDice[index] = !lockedDice[index];
  const diceElement = document.getElementById(`dice-${index + 1}`);
  if (lockedDice[index]) {
    diceElement.classList.add("selected");
    diceSelected.push();
  } else {
    diceElement.classList.remove("selected");
  }
}

//display score that is possible from currently visible dices
function displaySpeculativeScore() {
  for (let i = 0; i < functionNames.length; i++) {
    document.getElementById(
      `${functionNames[i].name.toLowerCase()}-${currentPlayer}`
    ).textContent = functionNames[i](diceRolled);
  }
}

// Function to lock the score for a category
function lockScore(category) {
  const scoreElement = document.getElementById(`${category}-score`);
  const lockButton =
    scoreElement.parentElement.nextElementSibling.firstElementChild;

  // Check if the score is already locked
  if (!scoreElement.classList.contains("locked")) {
    scoreElement.classList.add("locked");
    lockButton.textContent = "Unlock";
  } else {
    scoreElement.classList.remove("locked");
    lockButton.textContent = "Lock";
  }
}
