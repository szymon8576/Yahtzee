//throw and round number
let rollNumber = 0;
let roundNumber = 1;

//dice information
let diceAnywhere = []; //all dice in play array
let diceOnTable = []; //on-table die array
let diceSelected = []; //selected dies array
let currentDieIndex;  //die selection/deselection
let dieIndexHolder = [0,1,2,3,4];
let selectedDiceElements; //HTML Collection

//DOM Elements
const diceArea=document.getElementsByClassName("dice-display");
const rollButton = document.getElementById("rollDice");

//Random number between 1-6
function randomDie() {
	return Math.floor(Math.random() * (6 - 1 + 1)) + 1;
}

