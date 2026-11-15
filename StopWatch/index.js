// Stop Watch JavaScript Code

const time = document.getElementById('time');
const lapsContainer = document.getElementById('laps');


let startTime = 0;
let timer = null;
let elapsedTime = 0;
let isRunning = false;


function start() {

    if (!isRunning) {
        startTime = Date.now() - elapsedTime;
        timer = setInterval(update, 10);
        isRunning = true;
    }

}

function lap() {
    if (isRunning) {
        const lapNum = lapsContainer.children.length + 1;
        const lapTime = document.createElement('li');

        let colorClass = '';
        if (lapNum === 1) colorClass = 'lap-gold';
        else if (lapNum === 2) colorClass = 'lap-silver';
        else if (lapNum === 3) colorClass = 'lap-bronze';
        else if (lapNum === 4) colorClass = 'lap-burgundy';

        lapTime.className = `lap-item ${colorClass}`;
        lapTime.textContent = `#${lapNum} - ${time.textContent}`;
        lapsContainer.appendChild(lapTime);
    }
}



function stop() {
    if (isRunning) {
        clearInterval(timer);
        elapsedTime = Date.now() - startTime;
        isRunning = false;
    }
}

function reset() {
    clearInterval(timer);
    startTime = 0;
    elapsedTime = 0;
    isRunning = false;
    time.textContent = '00:00:00:00';
    lapsContainer.innerHTML = '';
}

function update() {

    const currentTime = Date.now();
    elapsedTime = currentTime - startTime;
    let hours = Math.floor(elapsedTime / (1000 * 60 * 60));
    let minutes = Math.floor(elapsedTime / (1000 * 60) % 60);
    let seconds = Math.floor(elapsedTime / 1000 % 60);
    let milliseconds = Math.floor(elapsedTime % 1000 / 10);

    hours = hours.toString().padStart(2, '0');
    minutes = minutes.toString().padStart(2, '0');
    seconds = seconds.toString().padStart(2, '0');
    milliseconds = milliseconds.toString().padStart(2, '0');

    time.textContent = `${hours}:${minutes}:${seconds}:${milliseconds}`;
}