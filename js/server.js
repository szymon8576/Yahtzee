
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
  

  function emitTableState(playerChange = false){

    let state = getTableState();
    state["player_change"] = playerChange

    let data = {new_state: state, table_id: getCookieValue("table_id"), user_uuid:getCookieValue("uuid")}
    socket.emit('update', data);

  }


  socket.on('update', (data) => {
    console.log('New table state:', data);

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
  
