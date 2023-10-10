//change the icon on recording button
const recordingButton = document.getElementById("recordingButton");

//Record audio when button is clicked
// Get references to the HTML elements
const audioPlayer = document.getElementById("audioPlayer");

let mediaRecorder;
let audioChunks = [];
let isRecording = false;

recordingButton.addEventListener("click", () => {
  if (!isRecording) {
    startRecording();
  } else {
    stopRecording();
  }
});

function startRecording() {
  navigator.mediaDevices
    .getUserMedia({ audio: true })
    .then(function (stream) {
      mediaRecorder = new MediaRecorder(stream);

      mediaRecorder.ondataavailable = function (event) {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
      };

      mediaRecorder.onstop = function () {
        const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
        const audioUrl = URL.createObjectURL(audioBlob);
        audioPlayer.src = audioUrl;
      };

      mediaRecorder.start();
      recordingButton.textContent = "Stop Recording";
      recordingButton.insertAdjacentHTML(
        "beforeend",
        `<i class="fas fa-microphone-slash" style='font-size:30px; padding:5px 2px; color:red'></i>`
      );

      isRecording = true;
      console.log(mediaRecorder.state);
    })
    .catch(function (err) {
      console.error("Error accessing the microphone: ", err);
    });
}

function stopRecording() {
  if (mediaRecorder && mediaRecorder.state !== "inactive") {
    mediaRecorder.stop();
    mediaRecorder.stream.getTracks()[0].stop(); // ensure mediaRecorder is properly finalised
    recordingButton.textContent = "Start Recording ";
    recordingButton.insertAdjacentHTML(
      "beforeend",
      `<i class="fas fa-microphone" style='font-size:30px; padding:5px 8px; color:green'></i>`
    );
    console.log(mediaRecorder.state);
    isRecording = false;
  }
}
