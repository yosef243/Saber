let masbahaState = null;

function updateCounterUI() {
    document.getElementById('totalCounter').textContent = masbahaState.count;
    document.getElementById('dhikrText').textContent = TASBEEH_AZKAR[masbahaState.currentZekrIdx];
    let currentBatch = masbahaState.count % 33;
    if (masbahaState.count > 0 && currentBatch === 0) currentBatch = 33;
    document.getElementById('batchCounter').textContent = `${currentBatch} / 33`;
}

function incrementCounter() {
    if (!masbahaState) return;
    masbahaState.count++;
    playClick();
    vibrate(15);
    
    if (masbahaState.count % 33 === 0) {
        masbahaState.currentZekrIdx = (masbahaState.currentZekrIdx + 1) % TASBEEH_AZKAR.length;
        masbahaState.batchCount++;
        launchConfetti();
        if (navigator.vibrate) navigator.vibrate([50, 50]);
    }
    updateCounterUI();
    saveData(masbahaState);
}

function confirmReset() {
    if (!masbahaState) return;
    if (confirm('تصفير العداد؟')) {
        masbahaState.count = 0;
        masbahaState.currentZekrIdx = 0;
        masbahaState.batchCount = 1;
        updateCounterUI();
        saveData(masbahaState);
    }
}

window.incrementCounter = incrementCounter;
window.confirmReset = confirmReset;

function initMasbaha(state) {
    masbahaState = state;
    updateCounterUI();
}
window.initMasbaha = initMasbaha;