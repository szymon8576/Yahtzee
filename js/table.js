const userPosition = parseInt(getCookieValue("user_position"), 10);;

const recordingButton = document.getElementById("recordingButton");

let isRecording = false;
let audioContext = new (window.AudioContext || window.webkitAudioContext)();

recordingButton.addEventListener("click", () => {
  if (!isRecording) {
    startRecording();
  } else {
    stopRecording();
  }
});



function recognizeAudio(audioBlob){

    let formData = new FormData();
    formData.append("audio_data", audioBlob, "audio_data");

    fetch('http://localhost:5000/speech-recognition/recognize', { method: 'POST', body: formData })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Network response was not ok');
      }
    })
    .then(data => {
      console.log('Response from server:', data);

      data.forEach((value) => {
        //get index of (first) dice with given value
        const index = diceRolled.findIndex((element, i) => (element === value) & lockedDice[i] == false);
        
        // if value was found, mark it as selected
        if (index != -1)
        {
          lockedDice[index] = true;
          displaySelectedDices();
        }

      });
    })
    .catch(error => {
      console.error('Error:', error);
    });

}


// Start audio recording
function startRecording() {
    navigator.mediaDevices.getUserMedia({ audio: true, noiseSuppression: false, echoCancellation: false,  })
      .then(function(stream) {
        audioChunks = [];
        recorder = new Recorder(audioContext.createMediaStreamSource(stream));
        recorder.record();
      })
      .catch(function(error) {
        console.error('Error accessing microphone:', error);
      });
      
      
      recordingButton.textContent = "Stop Recording";
      recordingButton.insertAdjacentHTML(
        "beforeend",
        `<i class="fas fa-microphone-slash" style='font-size:30px; padding:5px 2px; color:red'></i>`
      );

      isRecording = true;


  }



function stopRecording() {
    if (recorder && recorder.recording) {
      recorder.stop();
      recorder.exportWAV(function(blob) {
        console.log(blob);
        recognizeAudio(blob);

      });

    recordingButton.textContent = "Start Recording ";
    recordingButton.insertAdjacentHTML(
      "beforeend",
      `<i class="fas fa-microphone" style='font-size:30px; padding:5px 8px; color:green'></i>`
    );
    isRecording = false;
    }
 
  }

  function getCookieValue(cookieName) {
    const name = cookieName + '=';
    const cookieArray = document.cookie.split(';');
    for (let i = 0; i < cookieArray.length; i++) {
        let cookie = cookieArray[i];
        while (cookie.charAt(0) === ' ') {
            cookie = cookie.substring(1);
        }
        if (cookie.indexOf(name) === 0) {
            return cookie.substring(name.length, cookie.length);
        }
    }
    return '';
  }


  console.log("creating socket");
  const socket = io('http://localhost:5000', {
    query: {
        user_uuid: getCookieValue("uuid"),
        room_id: getCookieValue("table_id"),
    }
});


var isSocketConnected = false; 
socket.on('connect', (data) => { isSocketConnected = true; socketEvent(data); console.log("connect", data)}); 
socket.on('reconnect', (data) => { isSocketConnected  = true; socketEvent(data); console.log("reconnect", data)}); 
socket.on('disconnect', (data) => { isSocketConnected  = false; socketEvent(data); console.log("disconnect", data) }); 
socket.on('connect_failed', (data) => { isSocketConnected  = false; socketEvent(data); console.log("connect_failed", data) }); 
socket.on('error', (data) => { isSocketConnected  = false; socketEvent(data); console.log("error", data) }); 
socket.on('reconnecting', (data) => { isSocketConnected  = false; socketEvent(data); console.log("reconnecting", data) }); 
socket.on('connect_error', (data) => { isSocketConnected  = false; socketEvent(data); console.log("connect_error", data) }); 
socket.on('connect_timeout', (data) => { isSocketConnected  = false; socketEvent(data); console.log("connect_timeout", data) }); 
socket.on('reconnect_error', (data) => { isSocketConnected  = false; socketEvent(data); console.log("reconnect_error", data) }); 
socket.on('reconnect_failed', (data) => { isSocketConnected  = false; socketEvent(data); console.log("reconnect_failed", data) }); 



const socketEvent = (data) => { 
    if(!isSocketConnected){
      alert(`Couldn't connect with game table (${data})`)
      window.location.href = "/js";
    }
}


if(userPosition==1) document.getElementById("gameStatus").innerText = `Waiting for opponent, share this code with your friend:${getCookieValue("table_id")}`


