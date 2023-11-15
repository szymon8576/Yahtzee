
function getTableState(){
    data = {"scores": {}, "selectedDices": []}
  
    for (let i = 0; i < functionNames.length; i++) {
        
        let cellId = `${functionNames[i].name.toLowerCase()}-${currentPlayer}`;
        let cellContent = document.getElementById(cellId).textContent;  
  
        data["scores"][cellId]  = cellContent;
  
    }
    
    data["lockedDices"] = lockedDice; //indexes of selected dices
    data["rolledDices"] = diceRolled;
    data["scoreFields"] = scoreFields;

    return data;

  }
  
var player2_cellIds = [];

for (var i = 0; i < categories_ids.length ; i++) {

  if (["Bonus", "Upper Table Total", "Total"].includes(categories_ids[i])) continue;

  cellId = `${categories_ids[i].replaceAll(" ", "").toLowerCase()}-2`;
  player2_cellIds.push([cellId, functionNames[i]] );
  
}

function randomResponseTime(){
  return Math.floor(Math.random() * (1500 - 500 + 1)) + 500;
}

function calculateCumulativeSum(array) {
  let sum = 0;
  return array.map(value => sum += value);
}

  function emitTableState(playerChange = false){

    let state = getTableState();
    state["player_change"] = playerChange

    let data = {new_state: state, table_id: getCookieValue("table_id"), user_uuid:getCookieValue("uuid")}
    socket.emit('update', data);

    

    
    if(playerChange && gameMode=="bot"){


    var responseTimes = Array.from({ length: 5 }, () => randomResponseTime());
    responseTimes = calculateCumulativeSum(responseTimes);
    console.log(responseTimes);


    setTimeout(() => {
      var bot_state = getTableState();
      if ( Math.random() < 0.9){
      const mostFrequent = bot_state.rolledDices.reduce((a, b, _, arr) => (arr.filter(v => v === a).length >= arr.filter(v => v === b).length ? a : b));
      bot_state.lockedDices = bot_state.rolledDices.map((e)=>e==mostFrequent);
      }
      else{
        bot_state.lockedDices = Array.from({ length: 5 }, () => Math.random() < 0.5);
      }
      bot_state["player_change"] = false;
      var bot_data = {new_state: bot_state, table_id: getCookieValue("table_id"), user_uuid:"BOT-"+getCookieValue("uuid")}
      socket.emit('update', bot_data); 
    }, responseTimes[0]);
    
    setTimeout(() => {
      var bot_state = getTableState();
    
    for(var i=0; i<5; i++){
      if (bot_state.lockedDices[i]) continue;
      else bot_state.rolledDices[i] =  Math.floor(Math.random() * 5)+1;
    }
    bot_state["player_change"] = false;
    var bot_data = {new_state: bot_state, table_id: getCookieValue("table_id"), user_uuid:"BOT-"+getCookieValue("uuid")}
    socket.emit('update', bot_data);
    }, responseTimes[1]);


    setTimeout(() => {
      var bot_state = getTableState();
      if ( Math.random() < 0.6){
      const mostFrequent = bot_state.rolledDices.reduce((a, b, _, arr) => (arr.filter(v => v === a).length >= arr.filter(v => v === b).length ? a : b));
      bot_state.lockedDices = bot_state.rolledDices.map((e)=>e==mostFrequent);
      }
      else{
        bot_state.lockedDices = Array.from({ length: 5 }, () => Math.random() < 0.5);
      }
      bot_state["player_change"] = false;
      var bot_data = {new_state: bot_state, table_id: getCookieValue("table_id"), user_uuid:"BOT-"+getCookieValue("uuid")}
      socket.emit('update', bot_data); 
    }, responseTimes[2]);

    setTimeout(() => {
      var bot_state = getTableState();
    
    for(var i=0; i<5; i++){
      if (bot_state.lockedDices[i]) continue;
      else bot_state.rolledDices[i] =  Math.floor(Math.random() * 5)+1;
    }
    bot_state["player_change"] = false;
    var bot_data = {new_state: bot_state, table_id: getCookieValue("table_id"), user_uuid:"BOT-"+getCookieValue("uuid")}
    socket.emit('update', bot_data);
    }, responseTimes[3]);


    setTimeout(() => {
      var bot_state = getTableState();
      var result = player2_cellIds.filter(item => !Object.keys(bot_state.scoreFields[2]).includes(item[0]));
      let result_scores =  result.map((e)=>e[1](bot_state.rolledDices));
      var bestCategory = result[result_scores.indexOf(Math.max(...result_scores))];
      
      bot_state.scoreFields[2][bestCategory[0]] = bestCategory[1](bot_state.rolledDices);
      bot_state["player_change"] = true;
      var bot_data = {new_state: bot_state, table_id: getCookieValue("table_id"), user_uuid:"BOT-"+getCookieValue("uuid")}
      socket.emit('update', bot_data);
      
    }, responseTimes[4]);


   

    }
  }


  socket.on('update', (data) => {

    //this condition means that room is not full yet, so we shouldn't display the table
    if (Object.keys(data).length == 0)
    {
      document.getElementsByClassName("game-body")[0].style.display="none"; //TODO make game-body hidden by default
    }
    else{

      document.getElementsByClassName("game-body")[0].style.display="flex";
      document.getElementById("gameStatus").innerText="";
      document.getElementById("gameStatus").style.display="none";


      diceRolled = data["rolledDices"];
      lockedDice = data["lockedDices"];
      
      updateDiceImages();
      displaySelectedDices();
  
      scoreFields = data["scoreFields"]
      boldLockedScoreFields();
  
      currentPlayer = data["current_player"]
      displaySpeculativeScore();


      //show/hide roll and voice recognition buttons
      if (userPosition == currentPlayer) 
      {
        rollButton.style.display = "block";
        recordingButton.style.display = "block";
      }
      else
      {
        rollButton.style.display = "none";
        recordingButton.style.display = "none";
        // TODO maybe instead of hiding disable them and make gray?
      }
      
      if (data["end_of_game"]){
        console.log("end of game")
        endGame();
      }
  
    }

    
    


  });
  
