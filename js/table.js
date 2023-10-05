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



const categories = [
    'Ones', 'Twos', 'Threes', 'Fours', 'Fives', 'Sixes', 'Upper Table Total',
    'Bonus', '3x', '4x', '3x+2x', 'Small Straight', 'Large Straight',
    'Yathzee', 'Chance', 'Total'
];

// Initialize the table and add onclick methods
const table = document.getElementById('score-table');

for (let i = 0; i < categories.length; i++) {
    const row = table.insertRow();
    
    // Add the category name to the first column
    const categoryCell = row.insertCell(0);
    categoryCell.textContent = categories[i];
    categoryCell.className = 'first-column';
    
    for (let j = 1; j <= 2; j++) {
        const cell = row.insertCell(j);
        cell.textContent = '';
        cell.id = `${categories[i]}-${j}`;
        cell.onclick = function() {
            // This function will be called when the cell is clicked
            const cellId = this.id;
            alert(`Cell clicked: ${cellId}`);
        };
    }
}