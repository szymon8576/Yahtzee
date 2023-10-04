const micOnLabel = document.getElementById('mic-on');
const micOffLabel = document.getElementById('mic-off');
const recordingButton = document.getElementById("recordingButton");
const micButtonText = document.getElementById("micButtonText");

micOffLabel.style.display="none";
micButtonText.innerText = "Start recording"

recordingButton.addEventListener('click', () => {

    micButtonText.innerText = (micButtonText.innerText === "Start recording") ? "End recording" : "Start recording"

    micOnLabel.style.display = (micOnLabel.style.display === "none") ? "inline-block" : "none"
    micOffLabel.style.display = (micOffLabel.style.display === "none") ? "inline-block" : "none"

    console.log('zmiana', micOnLabel.style.display, micOffLabel.style.display);
});
