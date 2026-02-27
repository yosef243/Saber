// إدارة الأدعية (الموحدة) والأذكار

let duasState = {
    currentType: 'deceased',
    deceasedIdx: 0,
    generalIdx: 0
};

function updateDuaText() {
    let text, total, counter;
    if (duasState.currentType === 'deceased') {
        text = DECEASED_DUAS[duasState.deceasedIdx];
        total = DECEASED_DUAS.length;
        counter = duasState.deceasedIdx + 1;
    } else {
        text = GENERAL_DUAS[duasState.generalIdx];
        total = GENERAL_DUAS.length;
        counter = duasState.generalIdx + 1;
    }
    document.getElementById('duaText').textContent = text;
    document.getElementById('duaCounter').textContent = counter;
    document.getElementById('duaTotal').textContent = total;
}

function setDuaType(type) {
    duasState.currentType = type;
    document.querySelectorAll('.dua-type-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`.dua-type-btn[onclick="setDuaType('${type}')"]`).classList.add('active');
    updateDuaText();
    saveData(duasState);
}

function changeDua(dir) {
    if (duasState.currentType === 'deceased') {
        duasState.deceasedIdx += dir;
        if (duasState.deceasedIdx >= DECEASED_DUAS.length) duasState.deceasedIdx = 0;
        if (duasState.deceasedIdx < 0) duasState.deceasedIdx = DECEASED_DUAS.length - 1;
    } else {
        duasState.generalIdx += dir;
        if (duasState.generalIdx >= GENERAL_DUAS.length) duasState.generalIdx = 0;
        if (duasState.generalIdx < 0) duasState.generalIdx = GENERAL_DUAS.length - 1;
    }
    updateDuaText();
    saveData(duasState);
}

function copyDua() {
    let text = duasState.currentType === 'deceased' 
        ? DECEASED_DUAS[duasState.deceasedIdx] 
        : GENERAL_DUAS[duasState.generalIdx];
    const footer = duasState.currentType === 'deceased' 
        ? "\n\n(عن روح المرحوم صبري كامل سليم)" 
        : "";
    navigator.clipboard.writeText(text + footer).then(() => {
        showToast('تم نسخ الدعاء');
    }).catch(() => {
        showToast('فشل النسخ');
    });
}

// الأذكار
function renderAzkar(type) {
    const list = document.getElementById('azkarList');
    const azkarArray = AZKAR[type] || [];
    list.innerHTML = azkarArray.map(z => `
        <div class="zekr-item">
            <div style="font-family:'Amiri';font-size:1.1rem;line-height:1.8;margin-bottom:5px;">${z.text}</div>
            <div style="font-size:0.8rem;color:var(--accent);font-weight:bold;">${z.count} مرات</div>
        </div>
    `).join('');
}

function toggleAzkar(type, btn) {
    document.querySelectorAll('.azkar-opt').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderAzkar(type);
}

window.setDuaType = setDuaType;
window.changeDua = changeDua;
window.copyDua = copyDua;
window.toggleAzkar = toggleAzkar;

function initDuasAzkar(state) {
    duasState = {
        currentType: state.currentType || 'deceased',
        deceasedIdx: state.deceasedIdx || 0,
        generalIdx: state.generalIdx || 0
    };
    updateDuaText();
    // تفعيل الزر المناسب
    document.querySelectorAll('.dua-type-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`.dua-type-btn[onclick="setDuaType('${duasState.currentType}')"]`).classList.add('active');
    renderAzkar('morning');
}
window.initDuasAzkar = initDuasAzkar;