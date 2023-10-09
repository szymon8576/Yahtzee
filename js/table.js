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
        `<i class="fas fa-microphone-slash" style='font-size:30px; padding:5px 2px'></i>`
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
      `<i class="fas fa-microphone" style='font-size:30px; padding:5px 8px'></i>`
    );
    console.log(mediaRecorder.state);
    isRecording = false;
  }
}
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
    cell.textContent = "";
    cell.id = `${categories_ids[i].replaceAll(" ", "").toLowerCase()}-${j}`;
    cell.onclick = function () {
      // This function will be called when the cell is clicked
      const cellId = this.id;
      alert(`Cell clicked: ${cellId}`);
    };
  }
}
