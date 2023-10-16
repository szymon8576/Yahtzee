//throw and round number
let rollNumber = 1;
let roundNumber = 1;

//dice information
let diceRolled = []; //all dice in play array
let diceSelected = []; //selected dices array
let currentDiceIndex; //dice selection/deselection
let lockedDice = [false, false, false, false, false];
let currentPlayer = 1;
let scoreFields = {1:{}, 2:{}};

//DOM Elements
const diceArea = document.getElementsByClassName("dice-display");
const rollButton = document.getElementById("rollDice");

// Initialize the table and add onclick methods
const categories_names = [
  "Ones",
  "Twos",
  "Threes",
  "Fours",
  "Fives",
  "Sixes",
  "Upper Table Total",
  "Bonus",
  "3x",
  "4x",
  "3x+2x",
  "Small Straight",
  "Large Straight",
  "Yahtzee",
  "Chance",
  "Total",
];

const categories_ids = [
  "Ones",
  "Twos",
  "Threes",
  "Fours",
  "Fives",
  "Sixes",
  "Upper Table Total",
  "Bonus",
  "Three of a kind",
  "Four of a kind",
  "Full house",
  "Small Straight",
  "Large Straight",
  "Yahtzee",
  "Chance",
  "Total",
];

const table = document.getElementById("score-table");

for (let i = 0; i < categories_names.length; i++) {
  const row = table.insertRow();

  // Add the category name to the first column
  const categoryCell = row.insertCell(0);
  categoryCell.textContent = categories_names[i];
  categoryCell.className = "first-column";

  for (let j = 1; j <= 2; j++) {
    const cell = row.insertCell(j);
    cell.classList.add("scoringCell");
    cell.classList.add("pointer");
    cell.textContent = "";
    cell.id = `${categories_ids[i].replaceAll(" ", "").toLowerCase()}-${j}`;
    cell.onclick = function () {

      const cellId = this.id;

      if(cellId.charAt(cellId.length - 1) != currentPlayer.toString())
        return 

      //push score to the right array
      // let scoreFields;
      // if (currentPlayer === 1) scoreFields = scoreFields1;
      // else scoreFields = scoreFields2;

      // Check if the score for this category has already been locked
      if (!Object.keys(scoreFields[currentPlayer]).includes(cellId)) {
        // Calculate and display the score based on the clicked category and current dice
        const score = functionNames[i](diceRolled);
        this.textContent = score;
        cell.classList.add("locked");

        // Lock the score for this category
        scoreFields[currentPlayer][cellId] = Number(
          document.getElementById(
            `${functionNames[i].name.toLowerCase()}-${currentPlayer}`
          ).textContent
        );
        console.log("appending key",cellId, "to scores of player", currentPlayer)
        console.log(scoreFields[currentPlayer]);
        changePlayer();

        // You can update a separate element to show the current player's turn
        // For example: document.getElementById("current-player").textContent = `Player ${currentPlayer}'s Turn`;
      } else {
        alert("Score for this category has already been locked.");
      }
    };
  }
}

//events
rollButton.addEventListener("click", function () {
  if (rollNumber < 2) {
    randomDice(), rollNumber++;
    console.log("roll number: ", rollNumber);
  }
  //disable button
  else if (rollNumber == 2) {
    randomDice(), console.log("roll number: ", rollNumber);
    rollButton.classList.add("disabled");
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
    for (let playerNum = 1; playerNum <= 2; playerNum++){
      
      let cellId = `${functionNames[i].name.toLowerCase()}-${playerNum}`;
      let cellContent = document.getElementById(cellId);  

      if(Object.keys(scoreFields[playerNum]).includes(cellId)){
        cellContent.textContent = scoreFields[playerNum][cellId];
      }
      else{
        if(playerNum == currentPlayer)
          cellContent.textContent = functionNames[i](diceRolled);
        else
          cellContent.textContent = ""
      }

      if(playerNum == currentPlayer)
        document.getElementById(cellId).classList.add("pointer");
      else  
        document.getElementById(cellId).classList.remove("pointer");

    }
   
  }
}

//remove selected class from the dices
function removeSelection() {
  const viewElements = document.querySelectorAll("img");
  viewElements.forEach((element) => {
    element.classList.remove("selected");
  });
}

//change Player when score is chosen
function changePlayer() {
  // Switch to the next player or end the game if needed
  currentPlayer = currentPlayer === 1 ? 2 : 1;
  rollNumber = 1;
  removeSelection();
  lockedDice = [false, false, false, false, false];
  roundNumber++;
  randomDice();
  displaySpeculativeScore();
  rollButton.classList.remove("disabled");
}
