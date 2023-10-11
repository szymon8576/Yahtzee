//change the icon on recording button
const recordingButton = document.getElementById("recordingButton");

//Record audio when button is clicked
// Get references to the HTML elements
const audioPlayer = document.getElementById("audioPlayer");

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
        const index = diceRolled.findIndex(element => element === value);
        
        // if value was found, mark it as selected
        if (index != -1)
        {
          const diceElement = document.getElementById(`dice-${index + 1}`);
          diceElement.classList.add("selected");
        }

      });
    })
    .catch(error => {
      console.error('Error:', error);
    });

}


// Start audio recording
function startRecording() {
    navigator.mediaDevices.getUserMedia({ audio: true })
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
        audioPlayer.src = URL.createObjectURL(blob);
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
