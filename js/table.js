const micToggle = document.getElementById('mic-toggle');

micToggle.addEventListener('click', () => {
    micToggle.classList.toggle('mic-off');
    micToggle.classList.toggle('mic-on');
    console.log('zmiana');
});
