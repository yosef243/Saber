// JavaScript code extracted from index.html

let counter = 0;

function incrementCounter() {
    counter++;
    document.getElementById('counterDisplay').innerText = counter;
}

function duaFunction() {
    // logic for dua functionality
}

function toggleTheme() {
    // logic for theme toggle
}

document.getElementById('incrementButton').addEventListener('click', incrementCounter);
document.getElementById('duaButton').addEventListener('click', duaFunction);
document.getElementById('themeToggleButton').addEventListener('click', toggleTheme);